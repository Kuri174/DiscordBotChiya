const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const client = new discord.Client();

const mychannel_id = "779348258580987907";

http.createServer(function (req, res) {
    if (req.method == 'POST') {
        var data = "";
        req.on('data', function (chunk) {
            data += chunk;
        });
        req.on('end', function () {
            if (!data) {
                res.end("No post data");
                return;
            }
            var dataObject = querystring.parse(data);
            console.log("post:" + dataObject.type);
            if (dataObject.type == "wake") {
                console.log("Woke up in post");
                res.end();
                return;
            }
            res.end();
        });
    }
    else if (req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Discord Bot is active now\n');
    }
}).listen(3000);

client.on('ready', message => {
    console.log('Bot準備完了～');
    client.user.setActivity('ごちうさ', {
        type: 'WATCHING'
    });
    sendMsg(mychannel_id, "<@417553593697042432> \nおはよーーーーーー！！！！！！朝だよーーーーーー！！！！！！");
    sendMsg(mychannel_id, "<@&780007022933573633> \nおはよーーーーーー！！！！！！朝だよーーーーーー！！！！！！");
});

client.on('message', message => {
    if (message.author.id == client.user.id || message.author.bot) {
        return;
    }
    if (message.content.match(/にゃ～ん|にゃーん/)) {
        let text = "にゃ～んにゃん❤️";
        sendMsg(message.channel.id, text);
        return;
    }
    if (message.content.match(/こらー/)) {
        let text = "ごめんなさい><";
        sendMsg(message.channel.id, text);
        return;
    }
    if (message.content.match(/！ナツメちゃん/)) {
        sendMsg(message.channel.id, "はーい❤️");

        let mcount = 0;
        let text = "あと{}人 募集中\n";
        let revmsg = text.format(mcount);
        // friend_list 押した人のList
        let frelist = [];
        let msg = await client.send_message(message.channel, revmsg)

        // #投票の欄
        client.add_reaction(msg, '\u21a9')
        client.add_reaction(msg, '⏫')
        client.pin_message(msg)

        // リアクションをチェックする
        while (1) {
            let target_reaction = client.wait_for_reaction(message = msg);
            // 発言したユーザが同一でない場合 真
            if (target_reaction.user != msg.author) {

                // 押された絵文字が既存のものの場合 >> 左　del
                if (target_reaction.reaction.emoji == '\u21a9') {

                    // ◀のリアクションに追加があったら反応 frelistにuser.nameがあった場合　真
                    if (target_reaction.user.name in frelist) {
                        frelist.remove(target_reaction.user.name)
                        mcount += 1;
                        // リストから名前削除
                        client.edit_message(msg, text.format(mcount) + '\n'.join(frelist));
                        // メッセージを書き換え

                    } else pass
                    //押された絵文字が既存のものの場合 >> 右　add
                } else if (target_reaction.reaction.emoji == '⏫') {
                    if (target_reaction.user.name in frelist) {
                        pass
                    } else {
                        frelist.append(target_reaction.user.name);
                        // リストに名前追加
                        mcount = mcount - 1;
                        await client.edit_message(msg, text.format(mcount) +
                            '\n'.join(frelist));
                    }
                } else if (target_reaction.reaction.emoji == '✖') {
                    client.edit_message(msg, '募集終了\n' + '\n'.join(frelist));
                    client.unpin_message(msg);
                    break;
                    await client.remove_reaction(msg, target_reaction.reaction.emoji, target_reaction.user);
                // ユーザーがつけたリアクションを消す※権限によってはエラー
                }
            } else
                await client.edit_message(msg, '募集終了\n' + '\n'.join(frelist))
        }
    }
    return;
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log('DISCORD_BOT_TOKENが設定されていません。');
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);

function sendReply(message, text) {
    message.reply(text)
        .then(console.log("リプライ送信: " + text))
        .catch(console.error);
}

function sendMsg(channelId, text, option = {}) {
    client.channels.get(channelId).send(text, option)
        .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
        .catch(console.error);
}
