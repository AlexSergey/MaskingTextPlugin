function MaskText(options) {
    this.options = $.extend({
        mask: 'xxx-xxx-xxx',
        separator: '-'
    }, options);
    this.init();
}

MaskText.prototype = {
    init: function(){
        this.elem = $(this.options.holder);
        this.mask = this.options.mask;
        this.sep  = this.options.separator;

        this.pasteFirstValue();
        this.bind()
    },
    pasteFirstValue: function(){
        this.elem.one('focus', function(e) {
            this.elem.val(this.mask);
            this.maskingText(this.elem, this.mask, this.mask[0]);
        }.bind(this));
    },
    bind: function(){
        this.elem.on('keydown', this.validation.bind(this))
        this.elem.on('keyup',   this.upPaste.bind(this))
    },
    isNumeric: function(num, keyCode){
        var i, _i;
        if (isNaN(num)) {
            for (i = _i = 96; _i < 106; i = ++_i) {
                if (keyCode === i) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    },
    validation: function(e){
        var currentInput, index, indexKey, maskText, thisKey;

        currentInput = $(e.currentTarget);
        thisKey = e.keyCode;
        indexKey = e.target.selectionStart;
        this.carretIndex = indexKey;
        maskText = currentInput.val();

        if (thisKey === 8) {
            e.preventDefault();
            maskText = currentInput.val();
            index = e.target.selectionStart - 1;
            this.backspace(currentInput, maskText, index);

            e.target.selectionStart = this.carretIndex - 1;
            e.target.selectionEnd = this.carretIndex - 1;

            return;
        }
        if (e.ctrlKey === false) {
            e.preventDefault();

            if (thisKey === 37) {
                e.target.selectionStart = this.carretIndex - 1;
                e.target.selectionEnd = this.carretIndex - 1;

                return;
            } else if (thisKey === 39) {
                e.target.selectionStart = this.carretIndex + 1;
                e.target.selectionEnd = this.carretIndex + 1;

                return;
            } else if (thisKey === 189 || indexKey >= maskText.split('').length) {

                return;
            } else if (maskText.split('')[indexKey] === this.sep) {
                e.target.selectionStart = indexKey + 1;
                e.target.selectionEnd = indexKey + 1;

                return;
            } else if (this.isNumeric(String.fromCharCode(thisKey), thisKey)) {

                return;
            }

            this.indexKey = indexKey;
            this.maskingText(currentInput, maskText, thisKey, indexKey);
            e.target.selectionStart = this.indexKey + 1;
            e.target.selectionEnd = this.indexKey + 1;
        }
    },
    maskingText: function(currentInput, maskText, thisKey, indexKey){
        var currentText, pasteText, symbol;

        if (thisKey >= 96 && thisKey <= 106) {
            thisKey = thisKey - 48;
        }

        currentText = currentInput.val();
        symbol = String.fromCharCode(thisKey);
        currentText = maskText.split('');
        currentText[indexKey] = symbol;
        pasteText = currentText.join('');
        currentInput.data('value', pasteText);

        return currentInput.val(pasteText);
    },
    backspace: function(currentInput, pasteText, index){
        var currentText;

        currentText = pasteText.split('');
        if (currentText[index] === this.sep) {
            currentInput.val(pasteText);

            return;
        }

        currentText[index] = this.mask[0];
        pasteText = currentText.join('');

        return currentInput.val(pasteText);
    },
    upPaste: function(e) {
        var charCode, currentInput, currentLetter, i, indexKey, j, pastText, spliceText, valueNew, valueOld, valueOldArr;

        if (e.keyCode === 86) {
            currentInput = $(e.currentTarget);
            valueOld = currentInput.data('value');
            indexKey = e.target.selectionStart;
            valueNew = currentInput.val();
            spliceText = valueNew.split('').slice(this.carretIndex, indexKey);
            valueOldArr = valueOld.split('');
            i = 0;
            j = this.carretIndex;

            while (j < valueOldArr.length) {
                currentLetter = valueOldArr[j];
                charCode = currentLetter.charCodeAt(0);
                if (currentLetter === this.sep) {
                    j++;

                    continue;
                }
                if (i < spliceText.length) {
                    valueOldArr[j] = spliceText[i];
                } else {
                    valueOldArr[j] = valueOldArr[j];
                }

                j++;
                i++;
            }

            pastText = valueOldArr.join('');
            currentInput.val('');

            setTimeout(function() {
                return currentInput.val(pastText);
            }, 1);

            currentInput.data('value', pastText);

            return e.preventDefault();
        }
    }
}
$.fn.maskText = function(opt) {
    return this.each(function () {
        $(this).data('MaskText', new MaskText($.extend(opt,{holder:this})));
    });
};
$(function(){
    $('.mask').maskText({
        mask: 'xx-xxx-xxxx',
        separator: '-'
    })
    $('.mask2').maskText({
        mask: 'ooo+ooo+ooo',
        separator: '+'
    })
});