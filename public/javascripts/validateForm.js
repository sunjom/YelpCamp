(function() {
    //엄격모드
'use strict';
//모든 요소가 다 로드된 후 실행됨.
window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('validated-form');
    // from에 함수 조건에 맞을 경우 class를 추가해준다.
    var validation = Array.prototype.filter.call(forms, function(form) {
    form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }
        form.classList.add('was-validated');
    }, false);
    });
}, false);
})();