#!/bin/sh

time curl -X POST http://localhost:8000/query \
     -H "Content-Type: application/json" \
     -d '{"query":"Tell me a joke"}'
