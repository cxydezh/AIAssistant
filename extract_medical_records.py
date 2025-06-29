import asyncio
from playwright.async_api import async_playwright
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

async def extract_discharge_records():
    html_path = r'D:\CursorCode\pythoncode\AIAssistant\AI辅助示例数据\胡向明\胡向明-肾病科-病历-统一视图.html'
    txt_path = r'D:\CursorCode\pythoncode\AIAssistant\AI辅助示例数据\胡向明\出院记录提取.txt'
    debug_path = r'D:\CursorCode\pythoncode\AIAssistant\AI辅助示例数据\胡向明\出院记录调试列表.txt'
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

        discharge_selector = 'text=出院记录'
        await page.wait_for_selector(discharge_selector, timeout=10000)
        await page.click(discharge_selector)
        await page.wait_for_timeout(1000)

        # 获取所有相关条目
        items = await page.eval_on_selector_all(
            'table,.type-list,.emr-left',
            'els => els.filter(e => e.innerText && (e.innerText.includes("出院") || e.innerText.includes("记录") || e.innerText.includes("知情") || e.innerText.includes("谈话") || e.innerText.includes("病程") || e.innerText.includes("入院"))).map(e => "元素id：" + e.id + String.fromCharCode(10) +"元素class：" + e.className + String.fromCharCode(10) + "元素文本：" + e.innerText.trim())'
        )
        # 输出调试用条目
        with open(debug_path, 'w', encoding='utf-8') as f:
            for item in items:
                f.write(item + '\n')

        detail_text = ''
        if items:
            first_item_selector = f'text={items[0]}'
            try:
                await page.click(first_item_selector)
                await page.wait_for_timeout(1000)
                try:
                    await page.dblclick(first_item_selector, timeout=2000)
                    await page.wait_for_timeout(1000)
                except Exception:
                    pass  # 有些系统单击即可
                detail_text = await page.inner_text('body')
            except Exception as e:
                detail_text = f'点击条目失败: {e}'
        else:
            detail_text = '未找到出院记录列表或条目。'

        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write('【出院记录相关条目】\n')
            for item in items:
                f.write(item + '\n')
            f.write('\n【出院记录详情】\n')
            f.write(detail_text.strip())
        await browser.close()

if __name__ == "__main__":
    asyncio.run(extract_discharge_records()) 