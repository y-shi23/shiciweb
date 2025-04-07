import json
from collections import OrderedDict

def process_json(input_file, output_file):
    try:
        # 读取输入的 JSON 文件
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 处理每个字典
        processed_data = []
        for item in data:
            # 创建一个 OrderedDict，按指定顺序添加字段
            new_item = OrderedDict()
            new_item['title'] = item['title']
            new_item['author'] = ""           # 默认值为空字符串
            new_item['dynasty'] = ""          # 默认值为空字符串
            new_item['content'] = '\n'.join(item['content']) + '\n'
            new_item['appreciation'] = ""      # 在 content 后添加 appreciation，默认值为空字符串
            processed_data.append(new_item)
        
        # 将处理后的数据写入输出文件
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(processed_data, f, ensure_ascii=False, indent=2)
        
        print(f"处理完成，结果已保存到 {output_file}")
    
    except FileNotFoundError:
        print(f"错误：文件 {input_file} 不存在。")
    except json.JSONDecodeError:
        print(f"错误：文件 {input_file} 不是有效的 JSON 格式。")
    except Exception as e:
        print(f"发生错误：{e}")

if __name__ == "__main__":
    input_file = 'D:\\development\\shici\\python\\input.json'  # 输入文件路径
    output_file = 'D:\\development\\shici\\python\\output.json'  # 输出文件路径
    process_json(input_file, output_file)