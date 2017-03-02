
$(document).ready(function() {

  // Korean character and keyboard object
  var koreanKey = {
    koreanCharacter:
    ["ㅂ","ㅃ","ㅈ","ㅉ","ㄷ","ㄸ","ㄱ","ㄲ","ㅅ","ㅆ",
      "ㅛ","ㅕ","ㅑ","ㅐ","ㅒ","ㅔ","ㅖ",
      "ㅁ","ㄴ","ㅇ","ㄹ","ㅎ",
      "ㅗ","ㅓ","ㅏ","ㅣ",
      "ㅋ","ㅌ","ㅊ","ㅍ","ㅠ","ㅜ","ㅡ"],
    keyboardCharacter:
    ["q", "q", "w", "w", "e", "e", "r", "r", "t", "t",
      "y", "u", "i", "o", "o", "p", "p",
      "a", "s", "d", "f", "g",
      "h", "j", "k", "l",
      "z", "x", "c", "v", "b", "n", "m"],
    shiftBoolean:
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
      0, 0, 0, 0, 1, 0, 1,
      0, 0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0],
    characterCode:
    [113, 81, 119, 87, 101, 69, 114, 82, 116, 84,
      121, 117, 105, 111, 79, 112, 80,
      97, 115, 100, 102, 103,
      104, 106, 107, 108,
      122, 120, 99, 118, 98, 110, 109],
    };

  // Color scheme
  var colorScheme = {
    yellow: "rgba(250, 223, 99, 1)",
    red: "rgba(240, 96, 96, 1)",
    brown: "rgba(57, 58, 16, 1)",
    blue: "rgba(71, 86, 87, 1)",
    white: "rgba(198, 197, 185, 0.7)",
    green: "rgba(0, 168, 120, 1)",
    black: "#464646"
  }

  function getZeros(length) {
    var zeros = [];
    for (var i = 0; i < length; i++) {
      zeros.push(0);
    }
    return zeros;
  }

  var blacks = [];
  for (var i = 0; i < koreanKey.koreanCharacter.length; i++)
    blacks[i] = colorScheme.black;

  function getInitialScore(length) {
    return {
      appeared: getZeros(length),
      answered: getZeros(length),
      col: blacks
    };
  }

  var score = getInitialScore(koreanKey.koreanCharacter.length);
  score.appeared[0] = 1;

    // Score calculate:
    //   - heatmap of keyboard colored by percent correct, shift keys are split into two, keys not practiced in black, overlap with wrong/total numbers
    //   - stacked bar graph with correct/incorrect of each character with corresponding correct key
    //   - list of keys sorted by most times got wrong/most time shown

  $("#instruction").html(function() {
    var genInstruct = "Type the equivalent character to increase your streak<br>"
    var studyInstruct = "<span style='color:"+colorScheme.red+"'>SPACE</span>" +
      "<span style='color:"+colorScheme.white+"'> to go to the key</span><br>"
    var nextInstruct = "<span style='color:"+colorScheme.yellow+"'>&rarr;</span>" +
      "<span style='color:"+colorScheme.white+"'> to skip to the next character</span><br>"
    return(genInstruct+studyInstruct+nextInstruct)
  })

  // Add Korean characters to keyboard keyboard
  $.each(koreanKey.koreanCharacter, function(index, value) {
    var valueClass = (koreanKey.shiftBoolean[index] ?
      "koreanChar shiftChar" : "koreanChar");
    $("*#"+koreanKey.keyboardCharacter[index]+"-key").append(
      "<div class='"+valueClass+"'>"+value+"</div>"
    )
  });

  // Add popup div to each key
  $("#keyboard-graphic-data div div div").each(function() {
    var index = koreanKey.koreanCharacter.indexOf($(this).text());
    var percCorr = score.answered[index]/score.appeared[index]*100;

    var textVal = score.answered[index]+"/"+score.appeared[index]+
    "<br>("+(isNaN(percCorr) ? "-" : percCorr+"%")+")"

    $(this).append(
      "<div class='keyNotPopped'>"+textVal+"</div>"
    )
  });

  $(function() {
    var moveLeft = 20;
    var moveDown = 10;

    $('#keyboard-graphic-data div div div').hover(function(e) {
      // console.log($(this).find("div.keyNotPopped").attr("class", "keyPopped"));
      $(this).find("div.keyNotPopped").show();

        //.css('top', e.pageY + moveDown)
        //.css('left', e.pageX + moveLeft)
        //.appendTo('body');
    }, function() {
      $(this).find("div.keyNotPopped").hide();
    });

    $('#keyboard-graphic-data div div div').mousemove(function(e) {
      $(this).find("div.keyNotPopped").css('top', moveDown).css('left', moveLeft);
    });

  });

  // Calculate a random korean character from array without repeat
  function NextKoreanChar(currQuestionText) {
    var randChar = koreanKey.koreanCharacter[
      Math.floor(Math.random() * koreanKey.koreanCharacter.length)];
    if (currQuestionText === randChar) {
      return NextKoreanChar($("#question-text").text())
    } else {
      score.appeared[koreanKey.koreanCharacter.indexOf(randChar)] += 1;
      // console.log(randChar)
      return(randChar)
    }
  };

  // Check answer on website against typed
  function CheckAnswer(ans) {
    var isRight;
    var ansKorChar = koreanKey.characterCode.indexOf(ans);
    if ($("#question-text").text() === koreanKey.koreanCharacter[ansKorChar]) {
      isRight = 1;
      score.answered[ansKorChar] += 1;
      console.log("boo")
    } else {
      isRight = 0;
    }
    // console.log(isRight);
    return(isRight)
  };
  console.log(/d(b+)d/g.exec('cdbbdbsbz'))
  var decomposeColor = /(\w+)\W(\d+)\W(\s?)(\d+)\W(\s?)(\d+)/

  function CalcColorKeyboard(ind) {
    var rightCol = decomposeColor.exec(colorScheme.green)
    var wrongCol = decomposeColor.exec(colorScheme.red)
    var noneCol = decomposeColor.exec(colorScheme.black)

    var percWrong = 1-(score.answered[ind]/score.appeared[ind])

    score.col[ind] = "rgba("+
      String(
        Math.round((percWrong * Math.abs(rightCol[2] - wrongCol[2])) + rightCol[2]))+","+
      String(
        Math.round(rightCol[4]-(percWrong * Math.abs(rightCol[4] - wrongCol[4]))))+","+
      String(
        Math.round(rightCol[6]-(percWrong * Math.abs(rightCol[6] - wrongCol[6]))))+",1)";

    // console.log(score.col[ind])
    // $("#keyboard-graphic-data div div#"+koreanKey.keyboardCharacter[ind]+"-key"+
    //   (koreanKey.shiftBoolean[ind] === 0 ? " div.koreanChar" : "div.koreanChar.shiftChar")).css(
    //     "background-color", score.col[ind])

    $("#keyboard-graphic-data div div#"+koreanKey.keyboardCharacter[ind]+"-key div").filter(function() {
      return $(this).attr("class") === (koreanKey.shiftBoolean[ind] === 0 ? "koreanChar" : "koreanChar shiftChar")}).css(
          "background-color", score.col[ind]);
      }
//
//     $("td").filter(function() {
//   return $(this).text() == "Hello";
// }).text('Hi');

  // Go to next character and reset
  function NextButton() {
    $("#question-text").html(NextKoreanChar($("#question-text").text()));
    $("#numCorrect")
      .stop(true, true)
      .css("font-size", "14px")
      .html(0)
      .fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)
  }

  // Update div after each round
  function UpdatePopupScore() {
    var ind = koreanKey.koreanCharacter.indexOf($("#question-text").text())
    console.log(ind)
    var percCorr = score.answered[ind]/score.appeared[ind]*100;

    var textVal = score.answered[ind]+"/"+score.appeared[ind]+
    "<br>("+(isNaN(percCorr) ? "-" : percCorr+"%")+")"

    console.log($("#keyboard-graphic-data div div#"
      +koreanKey.keyboardCharacter[ind]
      +"-key div div.keyNotPopped").text())

    $("#keyboard-graphic-data div div#"
      +koreanKey.keyboardCharacter[ind]
      +"-key div div.keyNotPopped").html(textVal);
  }

  // Open/close keyboard key on click study/click close, hit escape or click outside
  $(".button").click(function() {
    $("#popup1").attr("class", "overlayShow");
  });
  $(".close").click(function() {
    $("#popup1").attr("class", "overlay");
  });
  $(".overlay").click(function(e) {
    if ($(e.target).attr("class") === "overlayShow") {
      $("#popup1").attr("class", "overlay");
      $("#popup2").attr("class", "overlay");
    }
  });

  // Open/close keyboard key on click study/click close, hit escape or click outside
  $("#data-button").click(function() {
    $("#popup2").attr("class", "overlayShow");
  });
  $(".close").click(function() {
    $("#popup2").attr("class", "overlay");
  });

  // Reset scores and keyboard graphic when button is clicked
  $("#reset-button").on("click", function() {
    // console.log('before reset', score)
    score = getInitialScore(koreanKey.koreanCharacter.length);
    // console.log('after reset', score)

    $("#keyboard-graphic-data div div div.koreanChar")
      .each(function() {
                $(this).css("background-color", "#464646");
      })

    $("#keyboard-graphic-data div div div div.keyNotPopped")
      .html("0/0<br>(--)");

    var ind = koreanKey.koreanCharacter.indexOf($("#question-text").text())
    score.appeared[ind] = 1;

    UpdatePopupScore()
    console.log(score);
  });

  // Next button goes to next letter
  $("#next-button").click(function() {NextButton()});


  $(document).on("keydown", function (e) {
    // Escape pressed
    if (e.which === 27) {

      $("#popup1").attr("class", "overlay");
      $("#popup2").attr("class", "overlay");

    // Right button goes to the next character//
  } else if (e.originalEvent.key === "ArrowRight") {
    NextButton();

    // Tab pressed opens study menu
  } else if (e.keyCode === "0" | e.keyCode === 32) {
    if ($("#popup2").attr("class") != "overlayShown") {
      var currShown = ($("#popup1").attr("class") === "overlay" ?
        "overlayShown" : "overlay")
      $("#popup1").attr("class", currShown);
    } else {
    }

    // CTRL pressed
    }
    else if (e.ctrlKey) {
      if ($("#popup1").attr("class") != "overlayShown") {
        var currShown = ($("#popup2").attr("class") === "overlay" ?
          "overlayShown" : "overlay")
        $("#popup2").attr("class", currShown);
      }
      // Letter key pressed (if not letter key do nothing)
      } else if (koreanKey.characterCode.indexOf(e.which+32) >= 0) {
        console.log(score)

        // Calculate key pressed
        var keyVal = e.which + (e.shiftKey ? 0 : 32)

        // If answer matches key, flash green, calculate streak and display next character
        if (CheckAnswer(keyVal) === 1) {
          UpdatePopupScore();
          $("#question-area")
            .stop(true, true)
            .effect("highlight", {color: colorScheme.green})

          $("#numCorrect").html(function() {
            var numCorr = parseInt($("#numCorrect").text()) + 1
            $("#numCorrect").css("font-size", String(14+numCorr/40*30)+"px");
            return numCorr
          })
          CalcColorKeyboard((koreanKey.koreanCharacter.indexOf($("#question-text").text())))
          $("#question-text").html(NextKoreanChar($("#question-text").text()));

        // If answer does not match key, flash red, change streak to zero and flash x2
        } else {

          $("#question-area")
            .stop(true, true)
            .effect("highlight", {color: colorScheme.red}, 200)
        score.appeared[koreanKey.koreanCharacter.indexOf($("#question-text").text())] += 1
        UpdatePopupScore();
        CalcColorKeyboard((koreanKey.koreanCharacter.indexOf($("#question-text").text())))
          $("#numCorrect")
            .stop(true, true)
            .css("font-size", "14px")
            .html(0)
            .fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)

        }

        // Update div
      }
  });
});
