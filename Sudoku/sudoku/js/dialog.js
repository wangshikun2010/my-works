var ndDialogPause,
    ndDialogHelp,
    ndDialogRule;

var dialogs = {
    pause: ndDialogPause,
    help: ndDialogHelp,
    rule: ndDialogRule
};

/*
 * <input type="button" id="j-btn-pause" data-dialog="pause" value="PAUSE" />
 * <input type="button" id="j-btn-help" data-dialog="help" value="HELP" />
 * <input type="button" id="j-btn-rule" data-dialog="rule" value="RULE" />
 */

var dialogButtons = document.querySelectorAll('#j-btn-pause, #j-btn-help, #j-btn-rule');
for (var i=0, length=dialogButtons.length; i<length; i++) {
    dialogButtons[i].addEventListener('click', function (event) {
        var dialog = this.getAttribute('data-dialog');

        for (var key in dialogs) {
            if (key === dialog) {
                dialogs[key].style.display = 'block';
            } else {
                dialogs[key].style.display = 'none';
            }
        }

    }, false);
}

