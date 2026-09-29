"""Darwin IT company and vacancy research pipeline."""

__all__ = ["run_research"]


def run_research(*args, **kwargs):
    from src.darwin_it.pipeline import run_research as _run

    return _run(*args, **kwargs)
