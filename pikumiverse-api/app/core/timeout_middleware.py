import asyncio
import re
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import PlainTextResponse


class TimeoutMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, timeout_routes: dict[str, int], default_timeout: int = 30):
        super().__init__(app)
        self.timeout_routes = timeout_routes  # 特定のAPIごとのタイムアウト設定
        self.default_timeout = default_timeout  # デフォルトのタイムアウト時間

    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # 動的パスのマッチングを行う
        timeout = self.default_timeout
        for pattern, timeout_value in self.timeout_routes.items():
            if re.match(pattern, path):
                timeout = timeout_value
                break

        try:
            return await asyncio.wait_for(call_next(request), timeout=timeout)
        except asyncio.TimeoutError:
            return PlainTextResponse("Request Timeout", status_code=408)
