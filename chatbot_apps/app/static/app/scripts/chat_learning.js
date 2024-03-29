(function () {
    //------------------//
    //LearningModeの処理//
    //------------------//

    //FIXME:ここらへんの処理はPythonでできるなら値だけJSONとかで渡したい
    //FIXME:できるだけ2次元配列処理ではなく、MapとかにしてO(1)で速さあげたい。
    //とはいえ、一行ずつループ処理するならそんなかわらないかも？

    //CSVファイルを二次元配列([data,label]の配列)に変換
    /*function convertCSVtoArray(str) {
        let result = []
        let row = str.split("\n");

        for (let i = 0; i < row.length; i++) {
            result[i] = tmp[i].split(';')
        }
    }

    //CSVファイルをMap([data,label]の配列)に変換
    function convertCSVtoMap(str) {
        let result = []
        let row = str.split("\n");

        for (let i = 0; i < row.length; i++) {
            result[i] = tmp[i].split(';')
        }

        let answer_data = result.map((result_set, i) => ({
            value: result[0],
            answer:result[1]
        }))
    }

    //Twitterのデータファイル読み込み
    data_file = "data.csv"
    let req = new XMLHttpRequest();
    req.open("get", data_file);
    req.send(null)

    req.onload = function () {
        let dataset = convertCSVtoArray(req.responseText);
    }

    //Answerのデータファイル読み込み
    answer_file = "answer.csv"
    let req = new XMLHttpRequest();
    req.open("get", answer_file);
    req.send(null)

    req.onload = function () {
        let answerData = convertCSVtoMap(req.responseText);
    }*/

    //まずは動かす。
    //Promise使って可読性あげたい。今のままだとかなり読みづらい。
    //callback関数を変数にいれたほうがよいかも？

    //BotUIを作成
    let botui = new BotUI('chat-app')
    var data = [] //ラベル配列用初期化

    //Replyデータを取得する処理
    function getReply(f){
        $.ajax({
            'url': reply_url,
            'dataType': 'text',
            'type':'GET',
        }).done((res) => {
            reply = res.value
            f();
        })
    }

    getReply(init)
    
    //最初の処理
    function init() {
        botui.messeage.add({
            content: "こんにちは!学習モードです。"
        }).then(() => {
            getSentence(res => {
                sentence_data = res.value
                dataLabeling(sentense_data);
            });
        });
    }

    //文データを取得する処理
    function getSentence(f){
        $.ajax({
            'url': training_url,
            'dataType': 'text',
            'type':'GET',
        }).done(sentence_data => {
            f(sentence_data);
        })
    }

    //データにラベルをつける処理
    function dataLabeling(sentence_data) {
        botui.messeage.bot({
                delay: 200,
                content: sentence_data,
        }).then(() => {
            //正しい答えが入ってくるのをまつ
            return botui.action.select({
                placeholder: "Select Right Answer",
                value: 1,
                label: "label",
                options: reply,
                button: {
                    icon: 'check',
                    label: 'OK'
                }
            })
        }).then(function (res) {
            label = res.value;
            sendLabelData(label);
            afterPredict();
        })
    }

    //ラベルをPythonに送る処理
    function sendLabelData(label){
        $.ajax({
            'url': training_url,
            'data': {
                'sentence': sentence,
                'label':label,
            },
            'dataType':'Text',
            'type':'POST',
        }).done({
            end();
        })        
    }

    //予測後の処理
    function afterPredict() {
        botui.message.add({
            delay: 500,
            content: 'まだ続けますか？'
        }).then(function () {
            return botui.action.button({
                delay: 500,
                action: [{
                    icon: 'circle-thin',
                    text: 'はい',
                    value: true
                }, {
                    icon: 'close',
                    text: 'いいえ',
                    value: false
                }]
            });
        }).then(function (res) {
            if (res.value == false) {
                dataPreserve();
            }else{
                init();
            }
        });
    }

    //学習させたデータをCSVに保存する処理
    function dataPreserve() {
        $.ajax({
            'url': preserve_url,
            'data': {
                'exit': True,
            },
            'dataType': 'text',
            'type':'GET',
        }).done({
            end();
        })
    }

    //プログラムを終了する処理
    function end() {
        botui.message.bot({
            content: 'またね！',
        })
    }

})();