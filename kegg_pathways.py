__author__ = 'Christian'

from Bio.KEGG.REST import kegg_list, kegg_get

from flask import Flask, request

app = Flask(__name__)


@app.route("/list")
def list_pathways():
    res = kegg_list('pathway', 'hsa').read()
    return res


@app.route("/kgml/<pathway_id>")
def get_kgml(pathway_id):
    kgml = kegg_get(pathway_id, 'kgml').read()
    return kgml


def create():
    return app


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0')
