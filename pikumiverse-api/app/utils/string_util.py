def make_center_line(text: str, fill_char: str = "-", total_width: int = 20) -> str:
    """指定された文字列を中央に配置し、両側を指定の文字で埋める"""
    if len(fill_char) != 1:
        raise ValueError("fill_char は1文字である必要があります")
    return f" {text} ".center(total_width, fill_char)
