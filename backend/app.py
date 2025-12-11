from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import jwt
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)

# Secret key for JWT - in production, use environment variable
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')

# Hardcoded users database
USERS = {
    'manager@company.com': {
        'password': 'manager123',
        'role': 'manager',
        'name': 'Priyanshu Manager'
    },
    'worker@company.com': {
        'password': 'worker123',
        'role': 'worker',
        'name': 'Sarah Worker'
    },
    'sde@company.com': {
        'password': 'sde123',
        'role': 'sde',
        'name': 'Alex Developer'
    }
}

# Sample logs data for different roles
LOGS_DATA = {
    'manager': [
        {'id': 1, 'type': 'team', 'message': 'Team meeting scheduled for tomorrow', 'timestamp': '2024-12-10 10:00'},
        {'id': 2, 'type': 'report', 'message': 'Q4 performance report ready', 'timestamp': '2024-12-10 09:30'},
        {'id': 3, 'type': 'team', 'message': 'New hire onboarding completed', 'timestamp': '2024-12-09 15:45'}
    ],
    'worker': [
        {'id': 1, 'type': 'task', 'message': 'Complete project documentation', 'status': 'pending', 'timestamp': '2024-12-10 08:00'},
        {'id': 2, 'type': 'task', 'message': 'Review pull requests', 'status': 'completed', 'timestamp': '2024-12-09 14:20'},
        {'id': 3, 'type': 'task', 'message': 'Attend standup meeting', 'status': 'completed', 'timestamp': '2024-12-10 09:00'}
    ],
    'sde': [
        {'id': 1, 'type': 'deployment', 'message': 'Production deploy successful - v2.3.1', 'timestamp': '2024-12-10 11:30'},
        {'id': 2, 'type': 'error', 'message': 'Fixed memory leak in user service', 'timestamp': '2024-12-09 16:45'},
        {'id': 3, 'type': 'deployment', 'message': 'Staging environment updated', 'timestamp': '2024-12-09 10:15'}
    ]
}

def token_required(f):
    """Decorator to protect routes with JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def role_required(allowed_roles):
    """Decorator to check if user has required role"""
    def decorator(f):
        @wraps(f)
        def decorated_function(current_user, *args, **kwargs):
            if current_user['role'] not in allowed_roles:
                return jsonify({
                    'error': f'Access denied. This resource is only available to: {", ".join(allowed_roles)}'
                }), 403
            return f(current_user, *args, **kwargs)
        return decorated_function
    return decorator

@app.route('/')
def home():
    return jsonify({'message': 'Company Portal API', 'status': 'running'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    email = data.get('email')
    password = data.get('password')
    
    user = USERS.get(email)
    
    if not user or user['password'] != password:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Generate JWT token
    token = jwt.encode({
        'email': email,
        'role': user['role'],
        'name': user['name'],
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'token': token,
        'user': {
            'email': email,
            'role': user['role'],
            'name': user['name']
        }
    })

@app.route('/logs', methods=['GET'])
@token_required
def get_logs(current_user):
    """Generic logs endpoint that returns different data based on user role"""
    role = current_user['role']
    logs = LOGS_DATA.get(role, [])
    
    return jsonify({
        'role': role,
        'logs': logs,
        'user': current_user['name']
    })

@app.route('/logs/manager', methods=['GET'])
@token_required
@role_required(['manager'])
def get_manager_logs(current_user):
    """Manager-specific logs endpoint"""
    return jsonify({
        'role': 'manager',
        'logs': LOGS_DATA['manager'],
        'message': 'Manager logs retrieved successfully'
    })

@app.route('/logs/worker', methods=['GET'])
@token_required
@role_required(['worker'])
def get_worker_logs(current_user):
    """Worker-specific logs endpoint"""
    return jsonify({
        'role': 'worker',
        'logs': LOGS_DATA['worker'],
        'message': 'Worker tasks retrieved successfully'
    })

@app.route('/logs/sde', methods=['GET'])
@token_required
@role_required(['sde'])
def get_sde_logs(current_user):
    """SDE-specific logs endpoint"""
    return jsonify({
        'role': 'sde',
        'logs': LOGS_DATA['sde'],
        'message': 'SDE logs retrieved successfully'
    })

@app.route('/verify', methods=['GET'])
@token_required
def verify_token(current_user):
    """Verify if token is valid and return user info"""
    return jsonify({
        'valid': True,
        'user': current_user
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)