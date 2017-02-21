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
      122, 120, 99, 118, 98, 110, 109]
    };

  var colorScheme = {
    yellow: "rgba(250, 223, 99, 1)",
    red: "rgba(240, 96, 96, 1)",
    brown: "rgba(57, 58, 16, 1)",
    blue: "rgba(71, 86, 87, 1)",
    white: "rgba(198, 197, 185, 0.7)"
  }

  $("#instruction").html(function() {
    var genInstruct = "Type the equivalent character to increase your streak<br>"
    var studyInstruct = "<span style='color:"+colorScheme.red+"'>SPACE</span>" +
      "<span style='color:"+colorScheme.white+"'> to go to the key</span><br>"
    var nextInstruct = "<span style='color:"+colorScheme.yellow+"'>&rarr;</span>" +
      "<span style='color:"+colorScheme.white+"'> to skip to the next character</span><br>"
    return(genInstruct+studyInstruct+nextInstruct)
  })

  // Calculate a random korean character from array without repeat
  function NextKoreanChar(currQuestionText) {
    var randChar = koreanKey.koreanCharacter[
      Math.floor(Math.random() * koreanKey.koreanCharacter.length)];
    if (currQuestionText === randChar) {
      return NextKoreanChar($("#question-text").text())
    } else {
      // console.log(randChar)
      return(randChar)
    }
  };

  // Check answer on website against typed
  function CheckAnswer(ans) {
    var isRight;
    if ($("#question-text").text() ===
      koreanKey.koreanCharacter[koreanKey.characterCode.indexOf(ans)]) {
      isRight = 1;
    } else {
      isRight = 0;
    }
    // console.log(isRight);
    return(isRight)
  };

  // Go to next character and reset
  function NextButton() {
    $("#question-text").html(NextKoreanChar($("#question-text").text()));
    $("#numCorrect")
      .stop(true, true)
      .css("font-size", "14px")
      .html(0)
      .fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)
  }

  // Add Korean characters to keyboard keyboard
  $.each(koreanKey.koreanCharacter, function(index, value) {
    var valueClass = (koreanKey.shiftBoolean[index] ?
      "koreanChar shiftChar" : "koreanChar");
    $("#"+koreanKey.keyboardCharacter[index]+"-key").append(
      "<div class='"+valueClass+"'>"+value+"</div>"
    )
  });

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
    }
  });

  // Next button goes to next letter
  $("#next-button").click(function() {NextButton()});

  $(document).on("keydown", function (e) {
    console.log(e)
    // Escape pressed
    if (e.which === 27) {

      $("#popup1").attr("class", "overlay");

    // Right button goes to the next character//
  } else if (e.originalEvent.key === "ArrowRight") {
    NextButton();

    // Tab pressed opens study menu
  } else if (e.keyCode === "0" | e.keyCode === 32) {
      var currShown = ($("#popup1").attr("class") === "overlay" ?
        "overlayShown" : "overlay")
      $("#popup1").attr("class", currShown);
    // Letter key pressed (if not letter key do nothing)
    } else if (koreanKey.characterCode.indexOf(e.which+32) >= 0) {

        // Calculate key pressed
        var keyVal = e.which + (e.shiftKey ? 0 : 32)

        // If answer matches key, flash green, calculate streak and display next character
        if (CheckAnswer(keyVal) === 1) {

          $("#question-area")
            .stop(true, true)
            .effect("highlight", {color: "rgba(16, 155, 58, 1)"})

          $("#numCorrect").html(function() {
            var numCorr = parseInt($("#numCorrect").text()) + 1
            $("#numCorrect").css("font-size", String(14+numCorr/40*30)+"px");
            return numCorr
          })

          $("#question-text").html(NextKoreanChar($("#question-text").text()));

        // If answer does not match key, flash red, change streak to zero and flash x2
        } else {

          $("#question-area")
            .stop(true, true)
            .effect("highlight", {color: "rgba(102, 16, 31, 1)"}, 200)

          $("#numCorrect")
            .stop(true, true)
            .css("font-size", "14px")
            .html(0)
            .fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)

        }
      }
  });
});
