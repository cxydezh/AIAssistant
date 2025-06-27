import asyncio
from playwright.async_api import async_playwright
import shutil
import os

EDGE_PATHS = [
    r"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    r"C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
]

def find_edge_path():
    for path in EDGE_PATHS:
        if os.path.exists(path):
            return path
    return None

async def extract_and_classify():
    html_path = r'D:\CursorCode\pythoncode\AIAssistant\AI辅助示例数据\胡向明\胡向明-肾病科-统一视图.html'
    txt_path = r'D:\CursorCode\pythoncode\AIAssistant\AI辅助示例数据\胡向明\网页内容分类提取.txt'
    debug_html_path = r'D:\CursorCode\pythoncode\AIAssistant\AI辅助示例数据\胡向明\debug_page_content.html'
    debug_screenshot_path = r'D:\CursorCode\pythoncode\AIAssistant\AI辅助示例数据\胡向明\debug_page.png'
    file_url = 'file:///' + html_path.replace('\\', '/')

    edge_path = find_edge_path()
    launch_args = {
        'headless': False,
        'args': ['--disable-web-security']
    }
    if edge_path:
        launch_args['executable_path'] = edge_path

    async with async_playwright() as p:
        browser = await p.chromium.launch(**launch_args)
        page = await browser.new_page()
        await page.goto(file_url)
        await page.wait_for_timeout(2000)  # 等待页面渲染

        # 保存调试用源码和截图
        with open(debug_html_path, 'w', encoding='utf-8') as f:
            f.write(await page.content())
        await page.screenshot(path=debug_screenshot_path, full_page=True)

        # 1. 提取body所有可见文本
        all_text = await page.inner_text('body')

        # 2. 提取患者基本信息
        patient_info = await page.eval_on_selector_all(
            '.patient-info .block, .patient-info .block-wrapper .block',
            'els => els.map(e => e.innerText.trim()).filter(Boolean)'
        )
        # 3. 提取就诊记录表格
        table_rows = await page.eval_on_selector_all(
            '.patient-table .row-body',
            'els => els.map(row => Array.from(row.children).map(cell => cell.innerText.trim()))'
        )
        # 4. 其它主要内容
        titles = await page.eval_on_selector_all('h1, h2, h3', 'els => els.map(e => e.innerText.trim())')

        # 分类写入TXT
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write('【页面所有可见文本】\n')
            f.write(all_text.strip() + '\n\n')
            f.write('【患者基本信息】\n')
            for info in patient_info:
                f.write(info + '\n')
            f.write('\n【就诊记录表格】\n')
            for row in table_rows:
                f.write('\t'.join(row) + '\n')
            f.write('\n【页面标题】\n')
            for t in titles:
                f.write(t + '\n')
        await browser.close()

if __name__ == "__main__":
    asyncio.run(extract_and_classify()) 