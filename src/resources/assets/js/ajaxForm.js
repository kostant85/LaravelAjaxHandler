(function ($) {

    let defaults = {
        onSuccess: function () {},
        onFail: function () {},
        resetForm: true,
        wrapperInputClass: '.form-group',
        errorInputClass: 'has-error',
        errorMessageHtml: '<div class="alert alert-danger"></div>',
        errorMessageClass: '.alert.alert-danger'
    };

    // let options;

    let methods = {

        init: function (params) {
            let options = $.extend({}, defaults, params);
            if (!this.data('ajaxForm')) {
                this.data('ajaxForm', options);
                this.on('submit.ajaxForm', function () {
                    event.preventDefault();
                    let form = $(this);
                    let url = form.attr('action');
                    let formSerialize = form.serialize();
                    form.find(options.errorInputClass).removeClass(options.errorInputClass);
                    form.find(options.errorMessageClass).remove();
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: formSerialize,
                        success: function (result) {
                            if (options.resetForm) {
                                form[0].reset();
                            }
                            let userCallback = form.data('callback');

                            if (typeof window[userCallback] === 'function') {
                                window[userCallback]();
                            }

                            options.onSuccess(result, form);
                        },
                        statusCode: {
                            401: function (xhr) {
                                let errors = xhr.responseJSON;

                                if (errors.success === false) {
                                    let redirectUrl = errors.data.redirectUrl;
                                    window.location = redirectUrl;
                                }
                            },
                            403: function (xhr) {
                                let errors = xhr.responseJSON;
                                alert(errors.message);
                            }
                        },
                        error: function (xhr, status, error) {

                            if (typeof this.statusCode[xhr.status] != 'undefined') {
                                return false;
                            }

                            let data = xhr.responseJSON;
                            let errors = data.errors;

                            for (let key in errors) {
                                let selector = $('#' + key);
                                selector.parent(options.wrapperInputClass).addClass(options.errorInputClass);
                                let message = errors[key][0];
                                let errorHtml = $(options.errorMessageHtml).html(message);
                                selector.before(errorHtml);
                            }

                            console.log(errors);
                            options.onFail(errors, form);
                        }
                    });
                })
            }

            return this;
        }
    };

    $.fn.ajaxForm = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method "' + method + '" is not defined');
        }
    };
})(jQuery)