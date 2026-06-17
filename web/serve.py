#!/usr/bin/env python3
"""Servidor estático local para previsualizar la web del CEPA.
Uso:  python serve.py [puerto]   (por defecto 8123)
Fuerza los MIME types correctos y desactiva la caché para evitar
estilos "rotos" por archivos cacheados de otros proyectos en el mismo puerto.
Es solo una utilidad de desarrollo: puedes borrarla sin afectar el sitio.
"""
import http.server
import socketserver
import mimetypes
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8123
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# MIME types correctos, sin depender del registro de Windows
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("text/javascript", ".js")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("image/png", ".png")
mimetypes.add_type("application/json", ".json")


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Sin caché: siempre sirve la versión actual de los archivos
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


class ThreadedServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

with ThreadedServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"Sirviendo {DIRECTORY} en http://localhost:{PORT}/")
    httpd.serve_forever()
