from typing import Literal


TextColorType = Literal[
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
    "default",
    "bold",
    "underline",
    "invisible",
    "reverse",
    "bg_black",
    "bg_red",
    "bg_green",
    "bg_yellow",
    "bg_blue",
    "bg_magenta",
    "bg_cyan",
    "bg_white",
    "bg_default",
    "reset",
]

color_dict = {
    "black": "\033[30m",  # (文字)黒
    "red": "\033[31m",  # (文字)赤
    "green": "\033[32m",  # (文字)緑
    "yellow": "\033[33m",  # (文字)黄
    "blue": "\033[34m",  # (文字)青
    "magenta": "\033[35m",  # (文字)マゼンタ
    "cyan": "\033[36m",  # (文字)シアン
    "white": "\033[37m",  # (文字)白
    "default": "\033[39m",  # 文字色をデフォルトに戻す
    "bold": "\033[1m",  # 太字
    "underline": "\033[4m",  # 下線
    "invisible": "\033[08m",  # 不可視
    "reverse": "\033[07m",  # 文字色と背景色を反転
    "bg_black": "\033[40m",  # (背景)黒
    "bg_red": "\033[41m",  # (背景)赤
    "gb_green": "\033[42m",  # (背景)緑（typo かも？bg_green？）
    "bg_yellow": "\033[43m",  # (背景)黄
    "BG_blue": "\033[44m",  # (背景)青（typo かも？bg_blue？）
    "bg_magenta": "\033[45m",  # (背景)マゼンタ
    "bg_cyan": "\033[46m",  # (背景)シアン
    "bg_white": "\033[47m",  # (背景)白
    "bg_default": "\033[49m",  # 背景色をデフォルトに戻す
    "reset": "\033[0m",  # 全てリセット
}


def color_text(text: str, color: TextColorType) -> str:
    return color_dict[color] + text + color_dict["reset"]
