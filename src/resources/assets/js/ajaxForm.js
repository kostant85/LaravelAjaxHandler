/**
 * Created by kostya on 25.05.16.
 */

$.fn.ajaxForm = function(method) {
    var defaults = {
        form: this[0],
        url: '',
        onSuccess: function() {},
        onFail: function() {},
        resetForm: true
    };

    var methods = {

        init: function(params){
            var options = $.extend({}, defaults, params);
            methods._initClick(options);

            return this;
        },

        _initClick: function (options) {
            $(document).on('submit', options.form , function(event) {
                event.preventDefault();
                if (options.url === '') {
                    options.url = $(options.form).attr('action');
                }
                var formSerialize = $(options.form).serialize();
                $.ajax({
                    url: options.url,
                    type: 'POST',
                    data: formSerialize,
                    success: function (result) {
                        if (options.resetForm) {
                            options.form.reset();
                        }
                        var userCallback = form.data('callback');

                        if (typeof window[userCallback] === 'function'){
                            window[userCallback]();
                        }

                        options.onSuccess(result, options.form);
                    },
                    statusCode: {
                        401: function(xhr) {
                            var errors = xhr.responseJSON;

                            if (errors.success === false) {
                                var redirectUrl = errors.data.redirectUrl;
                                window.location = redirectUrl;
                            }
                        },
                        403: function(xhr) {
                            var errors = xhr.responseJSON;
                            alert(errors.message);
                        }
                    },
                    error: function(xhr, status, error) {

                        if (typeof this.statusCode[xhr.status] != 'undefined') {
                            return false;
                        }

                        var data = xhr.responseJSON;
                        var errors = data.errors;

                        for (var key in errors) {
                            var selector = $('#' + key);
                            selector.parent('.form-group').addClass('has-error');
                            var message = errors[key][0];
                            selector.before('<div class="alert alert-danger">' + message + '</div>');
                        }

                        console.log(errors);
                        options.onFail(errors, options.form);
                    }
                });

            })
        }
    };

    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
    } else {
        $.error('Method "' + method + '" is not defined');
    }
};
