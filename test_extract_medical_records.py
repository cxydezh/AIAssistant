import unittest
import os

class TestDischargeExtract(unittest.TestCase):
    def setUp(self):
        self.txt_path = r'AI辅助示例数据/胡向明/出院记录提取.txt'

    def test_txt_file_exists(self):
        self.assertTrue(os.path.exists(self.txt_path), "出院记录TXT文件未生成")

    def test_txt_file_content(self):
        with open(self.txt_path, 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn('出院', content, "TXT内容中未包含出院相关信息")
        self.assertTrue(len(content.strip()) > 20, "TXT内容过少，疑似未提取到有效信息")

if __name__ == '__main__':
    unittest.main() 