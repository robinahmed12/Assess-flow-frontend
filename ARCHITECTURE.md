# AssessFlow Architecture

## Dependency Direction

presentation -> application -> infrastructure -> domain

Rules:
- app = routing only
- features = business modules
- shared = reusable primitives
- Do not call APIs from presentation.
- Keep pages thin.
