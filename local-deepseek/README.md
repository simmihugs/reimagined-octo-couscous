# Run localllm backend

## setup
```shell
python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
```

## runing
```shell
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```
