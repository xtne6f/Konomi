
# ユーティリティをモジュールとして登録
from .TSInformation import TSInformation

import asyncio
import typing


def RunAwait(coro:typing.Coroutine):
    """
    非同期関数を同期的に実行するためのヘルパー
    非同期関数を実行し、結果が返ってくるのを待つ

    Args:
        coro (Coroutine): 非同期関数のコルーチン

    Returns:
        [Any]: 非同期関数の戻り値
    """

    # await で実行完了を待つ
    async def run(coro:typing.Coroutine):
        return await coro

    # asyncio.run() で非同期関数を実行し、戻り値を返す
    return asyncio.run(run(coro))
