# Prompto Test Suite

Unified test directory containing all tests for the Prompto system.

## Structure

```
tests/
├── backend/           # Backend API and utility tests
├── frontend/          # Frontend component tests (future)
├── extension/         # Chrome extension tests
├── integration/       # Full system integration tests
├── run_tests.py      # Test runner script
├── pytest.ini       # Pytest configuration
└── requirements.txt  # Test dependencies
```

## Running Tests

### All Tests
```bash
python tests/run_tests.py
```

### Specific Test Suites
```bash
# Backend only
python tests/run_tests.py --backend

# Integration only  
python tests/run_tests.py --integration

# Extension only
python tests/run_tests.py --extension
```

### Using pytest directly
```bash
cd tests
pytest backend/ -v
pytest integration/ -v
```

## Test Dependencies

Install test dependencies:
```bash
pip install -r tests/requirements.txt
```

## Test Types

- **Backend Tests**: Unit tests for API endpoints, utilities, and database models
- **Integration Tests**: End-to-end tests verifying full system functionality
- **Extension Tests**: Chrome extension functionality tests
- **Frontend Tests**: React component and UI tests (coming soon)

## Writing Tests

### Backend Tests
- Use pytest fixtures and markers
- Test database operations with transactions
- Mock external API calls

### Integration Tests  
- Test complete user workflows
- Verify API responses and data flow
- Test authentication and authorization

### Extension Tests
- Test content script injection
- Verify UI element detection
- Test message passing between components 