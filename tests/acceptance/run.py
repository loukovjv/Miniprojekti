import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from robot import run


def main():
    suite = Path(__file__).resolve().parent
    project = suite.parents[1]
    os.environ.setdefault("PLAYWRIGHT_BROWSERS_PATH", str(project / ".playwright"))

    handler = partial(SimpleHTTPRequestHandler, directory=str(project))
    with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server:
        worker = Thread(target=server.serve_forever, daemon=True)
        worker.start()
        try:
            return run(
                str(suite / "references.robot"),
                variable=[f"APP_URL:http://127.0.0.1:{server.server_port}/index.html"],
                outputdir=str(project / "robot-results"),
            )
        finally:
            server.shutdown()
            worker.join()


if __name__ == "__main__":
    raise SystemExit(main())
