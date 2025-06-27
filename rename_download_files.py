import os

# 目标目录
base_dir = r'D:\CursorCode\pythoncode\AIAssistant\AI辅助示例数据\胡向明'

for root, dirs, files in os.walk(base_dir):
    for filename in files:
        if filename.endswith('.下载'):
            old_path = os.path.join(root, filename)
            new_filename = filename[:-3]  # 去除最后3个字符
            new_path = os.path.join(root, new_filename)
            # 避免覆盖已存在的同名文件
            if not os.path.exists(new_path):
                os.rename(old_path, new_path)
                print(f'Renamed: {old_path} -> {new_path}')
            else:
                print(f'Skip (target exists): {old_path} -> {new_path}') 