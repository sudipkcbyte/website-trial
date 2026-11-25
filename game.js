* Question flow, timer, scoring, finishing a challenge */
(function (RB) {
  'use strict';

  var S = RB.state;
  var { $, fmt, PLAYERS, BANKS, norm, match, tier, TODAY, order, save, beep, jingle, board, suggest } = RB;

  /* ---------- Start a challenge ---------- */

  function startGame(day, practice) {
    S.G = {
      day: day,
      practice: practice,
      ord: order(day),   // question order for this day
      i: 0,              // current question number (0 to 6)
      score: 0,
      res: [],           // results so far
      used: {},          // answers already typed this run
      t: 25,             // seconds left
      locked: 0,         // 1 once the current answer is submitted
      hinted: 0,         // 1 once a "Did you mean?" suggestion was shown
      tm: null           // timer id
    };
    showQ();
  }

  /* ---------- Timer bar ---------- */

  function tick() {
    var bar = $('#pBar');
    $('#pT').textContent = Math.ceil(S.G.t);
    bar.className = 'timer' + (S.G.t <= 6 ? ' low' : '');
    bar.firstElementChild.style.width = (S.G.t / 25 * 100) + '%';
  }

  /* ---------- Show the current question ---------- */

  function showQ() {
    var b = BANKS[S.G.ord[S.G.i]];
    var inp = $('#pIn');

    $('#pMode').textContent = (S.G.practice ? 'PRACTICE #' : 'DAILY #') + S.G.day;
    $('#pQn').textContent = S.G.i + 1;
    $('#pSc').textContent = S.G.score;
    $('#pQ').textContent = b.q;
    $('#pRev').hidden = true;

    inp.value = '';
    inp.placeholder = 'TYPE YOUR ANSWER';
    inp.disabled = false;
    $('#pGo').disabled = false;

    S.G.locked = 0;
    S.G.hinted = 0;
    $('#pHint').textContent = '';
    S.G.t = 25;
    tick();

    clearInterval(S.G.tm);
    S.G.tm = setInterval(function () {
      S.G.t -= 0.1;
      if (S.G.t <= 0) {
        S.G.t = 0;
        tick();
        submit(true);   // time ran out
      } else {
        tick();
      }
    }, 100);

    inp.focus();
  }

  /* ---------- Submit an answer ---------- */

  function submit(timeout) {
    if (!S.G || S.G.locked) return;

    var b = BANKS[S.G.ord[S.G.i]];
    var inp = $('#pIn');
    var txt = inp.value.trim();

    if (!timeout) {
      // nothing typed
      if (!txt) return;

      // same answer typed earlier in this run
      if (S.G.used[norm(txt)]) {
        inp.value = '';
        inp.placeholder = 'ALREADY USED. TRY ANOTHER';
        beep(140, 0.2, 'sawtooth');
        return;
      }

      // close spelling: suggest once per question, do not lock yet
      if (!match(b, txt) && !S.G.hinted) {
        var sg = suggest(b, txt);
        if (sg) {
          S.G.hinted = 1;
          inp.value = sg.name;
          $('#pHint').textContent = 'Did you mean ' + sg.name + '? Press LOCK IT IN to confirm, or change it.';
          beep(440, 0.08);
          return;
        }
      }
    }

    // lock the answer
    $('#pHint').textContent = '';
    S.G.locked = 1;
    clearInterval(S.G.tm);
    inp.disabled = true;
    $('#pGo').disabled = true;

    // score it
    var e = txt ? match(b, txt) : null;
    var pts = 0;
    var tr = null;
    var share = 0;
    var msg;

    if (txt) S.G.used[norm(txt)] = 1;

    if (e) {
      share = e.w / b.total;
      tr = tier(share);
      pts = tr.pts;
      var cnt = Math.max(1, Math.round(share * PLAYERS));
      msg = '"' + e.name.toUpperCase() + '" was given by ' + fmt(cnt) + ' of ' + fmt(PLAYERS) +
            ' players (' + (share * 100).toFixed(share < 0.01 ? 2 : 1) + '%).';
    } else if (timeout && !txt) {
      msg = 'Time is up. No answer locked in.';
    } else {
      msg = '"' + txt.toUpperCase() + '" is not on the board. Zero points.';
    }

    S.G.score += pts;
    S.G.res.push({
      q: b.q,
      ans: e ? e.name : (txt || '(none)'),
      pts: pts,
      label: tr ? tr.label : 'NO SCORE'
    });

    // show the reveal panel
    var tg = $('#rTier');
    tg.textContent = tr ? tr.label : (txt || timeout ? 'NO SCORE' : '');
    tg.className = 'tier t' + pts;

    $('#pSc').textContent = S.G.score;
    $('#rPts').textContent = '+' + pts + ' PTS';
    $('#rTxt').textContent = msg;
    $('#rMeter').style.width = e ? Math.min(100, share * 500) + '%' : '0%';
    $('#pNext').textContent = S.G.i >= 6 ? 'SEE RESULTS' : 'NEXT';
    $('#pRev').hidden = false;

    jingle(pts);
    $('#pNext').focus();
  }

  /* ---------- Rank and title ---------- */

  function rankOf(score) {
    var higher = 0;
    board('daily').forEach(function (x) {
      if (!x.me && x.score > score) higher++;
    });
    return higher + 1;
  }

  function titleOf(s) {
    if (s >= 1000) return 'RAREBYTE LEGEND';
    if (s >= 600) return 'RAREBYTE EXPLORER';
    if (s >= 300) return 'RAREBYTE SCOUT';
    return 'ROOKIE BYTE';
  }

  /* ---------- Finish the challenge ---------- */

  function finish() {
    var g = S.G;
    var correct = g.res.filter(function (r) { return r.pts > 0; }).length;
    var rarest = Math.max.apply(null, g.res.map(function (r) { return r.pts; }));
    var r = {
      day: g.day,
      score: g.score,
      correct: correct,
      rarest: rarest,
      res: g.res,
      practice: g.practice,
      rank: rankOf(g.score),
      newBest: false
    };

    // only the real daily challenge changes your profile
    if (!g.practice) {
      var P = S.P;
      r.newBest = g.score > P.best;

      P.games++;
      P.total += g.score;
      P.streak = (P.lastDay === TODAY - 1 || P.lastDay === TODAY) ? P.streak + 1 : 1;
      P.lastDay = TODAY;
      P.longest = Math.max(P.longest, P.streak);
      P.best = Math.max(P.best, g.score);
      P.rare += g.res.filter(function (x) { return x.pts >= 100; }).length;
      if (r.rank <= 10) P.legend = 1;

      P.today = {
        day: TODAY,
        score: g.score,
        correct: correct,
        rarest: rarest,
        res: g.res,
        rank: r.rank
      };
      save(P);
    }

    S.G = null;
    S.LAST = r;
    location.hash = '#results';
  }

  Object.assign(RB, { startGame: startGame, showQ: showQ, submit: submit, rankOf: rankOf, titleOf: titleOf, finish: finish });
})(window.RB = window.RB || {});
