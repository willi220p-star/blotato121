"""NT private NDIS provider intelligence pipeline."""

__all__ = ["run_research"]


def run_research(*args, **kwargs):
    from src.nt_ndis.pipeline import run_research as _run

    return _run(*args, **kwargs)
