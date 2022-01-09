from flask import Flask, request, jsonify
import util
import pandas as pd

app = Flask(__name__)

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({
        'locations': util.get_location_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

@app.route('/predict_home_price', methods=['GET', 'POST'])
def predict_home_price():
    total_sqft = float(request.form['total_sqft'])
    location = str(request.form['location'])
    bhk = int(request.form['bhk'])
    bath = int(request.form['bath'])

    print(type(location))


    bhk_list = []
    df = pd.read_csv('./artifacts/final.csv')
    for i in range(1, 5):
        bhk_list.append(len(df[(df.location.str.lower() == location.lower()) & (df.bhk == i)]))

    min_price = min(df[df.location.str.lower() == location.lower()].price)
    max_price = max(df[df.location.str.lower() == location.lower()].price)
    step = (max_price - min_price) / 5
    
    price_list = []
    for i in range(0, 6):
        bench_mark_low = min_price + (i * step)
        bench_mark_high = min_price + ((i + 1) * step)

        price_list.append([bench_mark_low, bench_mark_high, len(df[(df.location.str.lower() == location.lower()) & (df.price >= bench_mark_low) & (df.price < bench_mark_high)])])

    response = jsonify({
        'data_info': [util.get_estimated_price(location,total_sqft,bhk,bath), bhk_list, price_list]
    })


    response.headers.add('Access-Control-Allow-Origin', '*')

    return response




# @app.route('/predict_home_rent', methods=['GET', 'POST'])
# def predict_home_rent():
#     total_sqft = float(request.form['total_sqft'])
#     location = request.form['location']
#     bhk = int(request.form['bhk'])
#     bath = int(request.form['bath'])

#     bhk_list = []
#     df = pd.read_csv('./artifacts/final.csv')
#     for i in range(1, 5):
#         bhk_list.append(len(df[(df.location == 'uttara sector 1') & (df.bhk == i)]))

#     min_price = min(df[df.location == 'uttara sector 1'].price)
#     max_price = max(df[df.location == 'uttara sector 1'].price)
#     step = (max_price - min_price) / 5
    
#     price_list = []
#     for i in range(0, 6):
#         bench_mark_low = min_price + (i * step)
#         bench_mark_high = min_price + ((i + 1) * step)

#         price_list.append([bench_mark_low, bench_mark_high, len(df[(df.location == 'uttara sector 1') & (df.price >= bench_mark_low) & (df.price < bench_mark_high)])])

#     response = jsonify({
#         'data_info': [util.get_estimated_price(location,total_sqft,bhk,bath), bhk_list, price_list]
#     })
#     response.headers.add('Access-Control-Allow-Origin', '*')

#     return response






if __name__ == "__main__":
    print("Starting Python Flask Server For Home Price Prediction...")
    util.load_saved_artifacts()
    app.run()