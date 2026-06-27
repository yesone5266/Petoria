from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def home():
  return render_template('index.html')

@app.route("/play")
def choice():
  pet_name = request.args.get('pet_name')
  pet_tpye = request.args.get('pet_tpye')
  return render_template('play.html', pet_name = pet_name, pet_tpye = pet_tpye)

if __name__ == '__main__':
    app.run(debug=True)