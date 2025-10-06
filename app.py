from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__)
app.secret_key = 'your-secret-key-goes-here'

# Expanded user data to include profile-specific information
SAMPLE_USERS = {
    "user1": {
        "name": "Alice", 
        "avatar": "https://randomuser.me/api/portraits/women/1.jpg",
        "title": "Student at Tech University",
        "join_year": 2023,
        "tasks_completed": 15,
        "tasks_requested": 5,
        "rating": 4.9,
        "reviews": 30
    },
    "user2": {
        "name": "Bob", 
        "avatar": "https://randomuser.me/api/portraits/men/2.jpg",
        "title": "Postgrad at Arts College",
        "join_year": 2022,
        "tasks_completed": 8,
        "tasks_requested": 12,
        "rating": 4.7,
        "reviews": 18
    },
    "user3": {
        "name": "Charlie", 
        "avatar": "https://randomuser.me/api/portraits/women/3.jpg",
        "title": "Researcher at Science Institute",
        "join_year": 2021,
        "tasks_completed": 25,
        "tasks_requested": 2,
        "rating": 5.0,
        "reviews": 42
    },
    "admin": {
        "name": "Admin", 
        "avatar": "https://randomuser.me/api/portraits/lego/5.jpg",
        "title": "System Administrator",
        "join_year": 2020,
        "tasks_completed": 99,
        "tasks_requested": 99,
        "rating": 5.0,
        "reviews": 150
    },
    "guest": {
        "name": "Guest User", 
        "avatar": "https://randomuser.me/api/portraits/lego/8.jpg",
        "title": "Visitor",
        "join_year": 2024,
        "tasks_completed": 0,
        "tasks_requested": 1,
        "rating": 0.0,
        "reviews": 0
    }
}

# Sample data for the Wall of Shame
SHAME_LIST = [
    {
        "name": "Liam",
        "avatar": "https://randomuser.me/api/portraits/men/4.jpg",
        "reason": "Frequently cancels tasks",
        "count": 12,
        "rank": 1
    },
    {
        "name": "Sophia",
        "avatar": "https://randomuser.me/api/portraits/women/5.jpg",
        "reason": "Consistently low ratings",
        "count": 9,
        "rank": 2
    },
    {
        "name": "Ethan",
        "avatar": "https://randomuser.me/api/portraits/men/6.jpg",
        "reason": "Poor service quality",
        "count": 7,
        "rank": 3
    },
    {
        "name": "Olivia",
        "avatar": "https://randomuser.me/api/portraits/women/7.jpg",
        "reason": "Repeatedly late for tasks",
        "count": 5
    },
    {
        "name": "Noah",
        "avatar": "https://randomuser.me/api/portraits/men/8.jpg",
        "reason": "Unreliable communication",
        "count": 4
    },
    {
        "name": "Ava",
        "avatar": "https://randomuser.me/api/portraits/women/9.jpg",
        "reason": "Incomplete tasks",
        "count": 3
    }
]


@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    session.clear()
    if request.method == 'POST':
        username = request.form.get('username')
        if username in SAMPLE_USERS:
            session['user'] = SAMPLE_USERS[username]
            session['user']['username'] = username
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username. Please try one of the sample IDs.', 'error')
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'user' in session:
        return render_template('dashboard.html', user=session['user'])
    return redirect(url_for('login'))

@app.route('/profile')
def profile():
    if 'user' in session:
        return render_template('profile.html', user=session['user'])
    return redirect(url_for('login'))
    
@app.route('/my_tasks')
def my_tasks():
    if 'user' in session:
        return render_template('my_tasks.html')
    return redirect(url_for('login'))

@app.route('/shame')
def shame():
    if 'user' in session:
        return render_template('shame.html', users=SHAME_LIST)
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True, port=5001)
