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
      "a", "s", "d", "f", "g", "h", "j", "k", "l",
      "z", "x", "c", "v", "b", "n", "m"],
    shiftBoolean:
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
      0, 0, 0, 0, 1, 0, 1,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0],
    characterCode:
    [113, 81, 119, 87, 101, 69, 114, 82, 116, 84,
      121, 117, 105, 111, 79, 112, 80,
      97, 115, 100, 102, 103, 104, 106, 107, 108,
      122, 120, 99, 118, 98, 110, 109]
    };

  function NextKoreanCharRecur(currQuestionText) {
    var randChar = koreanKey.koreanCharacter[
      Math.floor(Math.random() * koreanKey.koreanCharacter.length)];
    if (currQuestionText === randChar) {
      return NextKoreanCharRecur($("#question-text").text())
    } else {
      // console.log(randChar)
      return(randChar)
    }
  };

  function CheckAnswer(ans) {
    if (koreanKey.characterCode.indexOf(ans) >= 0) {
      if ($("#question-text").text() === String.fromCharCode(ans + 12497)) {
        var isRight = 1;
      } else {
        var isRight = 0;
      }
    }
    // console.log(isRight);
    return(isRight)
  };

  //
  // $("#temporary-next-button").click(function () {
  //   {
  //     // // alert("temporary-next-button-onclick");
  //     // // alert(koreanChar[2]);
  //     // var randKoreanChar = GenRandKoreanChar(koreanChar);
  //     // while ($("#question-text").text() == koreanChar[randKoreanChar]) {
  //     //   // console.log("repeated");
  //     //   var randKoreanChar = GenRandKoreanChar(koreanChar);
  //     // }
  //     // // console.log(koreanChar[randKoreanChar])
  //     // $("#question-text").html(koreanChar[randKoreanChar]);
  //     //////
  //     $("#question-text").html(koreanChar[NextKoreanChar()])
  //   }
  // });

  $(document).on("keypress", function (e) {
    {
      // Correct and incorrect answer responses
      if (CheckAnswer(e.which) === 1) {
        $("#question-area").stop(true, true).effect("highlight", {color: "#008800"})
        $("#question-text").html(NextKoreanCharRecur($("#question-text").text()));
      } else {
        $("#question-area").stop(true, true).effect("highlight", {color: "#CC0000"})
      }
    }
  });
  $(document).on("keyup", function (e) {
      $("#"+String.fromCharCode(e.which).toLowerCase()+"-key").attr("class", "keys off");
  });
});


var onkeydown = (function (ev) {
  var key;
  var isShift;
  if (window.event) {
    key = window.event.keyCode;
    isShift = !!window.event.shiftKey; // typecast to boolean
  } else {
    key = ev.which;
    isShift = !!ev.shiftKey;
  }
  if ( isShift ) {
    switch (key) {
      case 16: // ignore shift key
        break;
      default:
        alert(key);
        // do stuff here?
        break;
    }
  }
});
