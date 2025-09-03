const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// OpenWeatherMapのAPIキー
const apiKey = 'a0a1cda928395d192491a7bfab4db8a1';

// テンプレートエンジンとしてEJSを使用（HTMLファイルの代わりに利用する）
app.set('view engine', 'ejs');

// POSTリクエストのbodyを解析するために必要になる
app.use(express.urlencoded({ extended: true }));

// ルートページにアクセスすると検索フォームを表示
app.get('/', (req, res) => {
  res.render('index'); // views/index.ejs を表示
});

// フォーム送信後、天気情報を取得して表示
app.post('/weather', (req, res) => {
  const city = req.body.city; // フォームから送信された都市名を取得
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=ja&units=metric`;

  axios.get(url)
    .then(response => {
      const weatherData = {
        city: response.data.name,
        weather: response.data.weather[0].description,
        temp: response.data.main.temp,
        windspeed: response.data.wind.speed
      };
      res.render('weather', { weather: weatherData }); // 取得した天気情報をweather.ejsで表示
    })
    .catch(error => {
      console.error("エラーが発生しました。", error);
      res.render('error', { errorMessage: '天気情報を取得できませんでした。' });
    });
});

// サーバーを起動
app.listen(port, () => {
  console.log(`サーバーがポート${port}で起動しました`);
});
