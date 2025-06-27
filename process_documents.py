import os
import traceback
import docx
import requests
import json
import pandas as pd
import xlrd
from win32com import client
import pythoncom
import time

def read_doc(file_path):
    """Reads content from a .doc file using win32com with better error handling."""
    word = None
    try:
        # 初始化COM组件
        pythoncom.CoInitialize()
        
        # 创建Word应用程序对象
        word = client.Dispatch("Word.Application")
        word.Visible = False
        word.DisplayAlerts = False  # 禁用警告对话框
        
        # 等待Word应用程序完全启动
        time.sleep(1)
        
        # 打开文档
        doc = word.Documents.Open(file_path)
        
        # 等待文档完全加载
        time.sleep(0.5)
        
        # 获取文档内容
        content = doc.Content.Text
        
        # 关闭文档
        doc.Close(SaveChanges=False)
        
        return content
        
    except Exception as e:
        print(f"COM方法读取失败，尝试使用替代方法: {e}")
        # 如果COM方法失败，尝试使用其他方法
        return read_doc_alternative(file_path)
    finally:
        try:
            if word:
                word.Quit()
        except:
            pass
        try:
            pythoncom.CoUninitialize()
        except:
            pass

def read_doc_alternative(file_path):
    """Alternative method to read .doc files using textract or other libraries."""
    
    try:
        # 尝试使用 antiword（如果系统中有安装）
        import subprocess
        result = subprocess.run(['antiword', file_path], capture_output=True, text=True)
        if result.returncode == 0:
            return result.stdout
    except Exception as e:
        print(f"antiword 方法失败: {e}")
    
    # 如果所有方法都失败，返回错误信息
    return f"无法读取 .doc 文件 {file_path}。请确保文件格式正确或尝试将文件转换为 .docx 格式。"

def read_xls(file_path):
    """Reads content from a .xls file using xlrd."""
    try:
        # 打开工作簿
        workbook = xlrd.open_workbook(file_path)
        
        content = ""
        for sheet_name in workbook.sheet_names():
            sheet = workbook.sheet_by_name(sheet_name)
            content += f"--- 工作表: {sheet_name} ---\n"
            
            # 读取所有行
            for row_idx in range(sheet.nrows):
                row_data = []
                for col_idx in range(sheet.ncols):
                    cell_value = sheet.cell_value(row_idx, col_idx)
                    # 处理不同的数据类型
                    if isinstance(cell_value, (int, float)):
                        row_data.append(str(cell_value))
                    else:
                        row_data.append(str(cell_value))
                content += " | ".join(row_data) + "\n"
            content += "\n"
        
        return content
    except Exception as e:
        return f"读取 xls 文件时出错 {file_path}: {e}"

def read_docx(file_path):
    """Reads content from a .docx file."""
    try:
        doc = docx.Document(file_path)
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        print(full_text)
        return '\n'.join(full_text)
    except Exception as e:
        # print traceback
        print(traceback.format_exc())
        return f"读取 docx 文件时出错 {file_path}: {e}"

def read_xlsx(file_path):
    """Reads content from a .xlsx file."""
    try:
        # 读取所有工作表
        df = pd.read_excel(file_path, sheet_name=None) 
        content = ""
        for sheet_name, sheet_df in df.items():
            content += f"--- 工作表: {sheet_name} ---\n"
            content += sheet_df.to_string()
            content += "\n\n"
        return content
    except Exception as e:
        return f"读取 xlsx 文件时出错 {file_path}: {e}"

def process_patient_records(folder_path):
    """
    处理文件夹中的所有 doc, docx, xls 和 xlsx 文件，将它们发送给 LLM,
    并请求 ICD-10 编码。
    """
    full_content = []
    print(f"正在从文件夹处理文件: {folder_path}")
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if filename.lower().endswith('.doc'):
            print(f"正在读取 Word 文件: {filename}")
            content = read_doc(file_path)
            full_content.append(content)
        elif filename.lower().endswith('.docx'):
            print(f"正在读取 Word 文件: {filename}")
            content = read_docx(file_path)
            full_content.append(content)
        elif filename.lower().endswith('.xls'):
            print(f"正在读取 Excel 文件: {filename}")
            content = read_xls(file_path)
            full_content.append(content)
        elif filename.lower().endswith('.xlsx'):
            print(f"正在读取 Excel 文件: {filename}")
            content = read_xlsx(file_path)
            full_content.append(content)

    if not full_content:
        print("在指定目录中未找到 DOC, DOCX, XLS 或 XLSX 文件。")
        return
    else:
        print(f"已读取以下文件：/n{', '.join(full_content)}")

    combined_content = "\n\n--- 下一个文档 ---\n\n".join(full_content)

    prompt = (
        f"这是患者的病历记录:\n\n{combined_content}\n\n"
        "---"
        "请根据病史检查.txt文件中的内容，检查病历.doc文档中的信息，为陈某某患者编辑一份病历书写质量评估的报告。"
    )

    print("\n正在向模型发送请求...")

    try:
        # 此处的API调用参数参考了 main.py
        response = requests.post(
            "http://172.17.40.16:11434/api/generate",
            json={
                "model": "deepseek-r1:32b", # 您可以根据需要更改模型
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.1 # 对于提取和格式化任务，使用较低的温度值
                }
            }
        )
        response.raise_for_status()
        # 直接从响应中获取结果
        result = response.json().get("response", "")
        
        print("\n--- 模型响应 ---")
        print(result)

        # 尝试解析JSON并格式化输出
        try:
            parsed_json = json.loads(result)
            print("\n--- 解析后的JSON ---")
            print(json.dumps(parsed_json, indent=2, ensure_ascii=False))
        except json.JSONDecodeError:
            print("\n警告: 模型的输出不是有效的JSON格式。")

    except requests.exceptions.RequestException as e:
        print(f"\n调用API时发生错误: {e}")

if __name__ == "__main__":
    # 重要提示: 请将此路径替换为您的文件夹的实际路径。
    # 在Windows上建议使用原始字符串(r"...")以避免反斜杠问题。
    patient_folder = r"C:\Users\Helianthus\Desktop\AI辅助示例数据\11784_林某_125"
    
    if not os.path.isdir(patient_folder):
        print(f"错误: 指定的文件夹不存在: {patient_folder}")
        print("请在脚本中更新 'patient_folder' 变量为正确的路径。")
    else:
        process_patient_records(patient_folder) 