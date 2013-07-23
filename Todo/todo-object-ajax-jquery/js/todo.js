$(function() {
    // document.domain = 'www.fegeeks.com';

    TODO_ID_PREFIX = 'todo';

    // use jquery selector get element node
    $ndTodoSync = $('#j-todo-sync');
    $ndTodoInputBox = $('#j-todo-input-box');
    $ndTodoSelectAll = $('#j-select-all');
    $ndTodoList = $('#j-todo-list');
    $ndFooter = $('footer');
    $ndTodoListLength = $('#j-todo-list-length');
    $ndTodoClearComplete = $('#j-todo-clear-complete');
    $ndTodoListCompleteLength = $('#j-todo-complete-length');

    todoListComplete = 0;
    ndTodoItem = null;
    isLoadAllItem = true;

    // todo init
    initTodo = function() {

        $(document).ajaxStart(function() {
            $ndTodoSync.show();
        }).ajaxStop(function() {
            $ndTodoSync.hide();
        })

        // get all data and add to page
        $.get('/cakephp-2.3.7/todos', null, function (response) {
            for (var i=0; i<response.length; i++) {
                addTodoItem(response[i]);
            }

            update();
            setFooterDisplay();
            clearAllComplete();
            selectAll();
        });

        // add a todoItem
        $(document.forms[0]).submit(function(event) {
            event.preventDefault();

            var todoInputValue = $ndTodoInputBox.val();
            $ndTodoInputBox.val('');
            addTodoItem(todoInputValue);
        });
    }

    addTodoItem = function(todoItem) {
        if (isLoadAllItem && typeof todoItem == 'object') {

            createATodoItem(todoItem.Todo.id, todoItem.Todo.content);

            // After loading is complete judgment todoItem
            if (todoItem.Todo.completed) {
                ndTodoItem.find('input[type=checkbox]')
                               .attr('checked', true)
                               .next('span')
                               .attr('class', 'todo__item__complete');
            } else {
                ndTodoItem.find('span')
                               .attr('class', 'todo__item__content');
            }

        } else {
            isLoadAllItem = false;

            createATodoItem(TODO_ID_PREFIX, todoItem);

            $.post('/cakephp-2.3.7/todos/add', 'data[content]=' + todoItem, function(response) {
                if (response.status == true) {
                    ndTodoItem.attr('id', ndTodoItem.attr('id') + response.data.Todo.id);
                }
            });
        }



        ndTodoItem.prependTo($ndTodoList);

        update();
        setFooterDisplay();

        // get todoItem checkbox and delete buttons
        var $ndTodoCheckbox = ndTodoItem.find('div>input[type=checkbox]');
        var $ndTodoDelete = ndTodoItem.find('a');

        // edit todoItem
        ndTodoItem.delegate('span', 'dblclick', function(event) {
            todo.editTodoItem($(this));
        });

        if ($ndTodoCheckbox.length > 0) {
            $ndTodoCheckbox.click(changeStyle);
        }

        if ($ndTodoDelete.length > 0) {
            $ndTodoDelete.click(deleteTodoItem);
        }

        function createATodoItem(todoItemId, todoItemContent) {
            ndTodoItem = $('<li id=todo' + todoItemId + ' class="todo__item"></li>');
            ndTodoItem.html('<div class="todo__item__view"><input type="checkbox" name="todoChecked" class="todo__item__checked">' + '<span class="todo__item__content" id="j-todo-list-value">' + todoItemContent + '</span>' + '<a class="todo__item__delete"></a></div><input type="text" class="todo__item__edit" maxlength="25">');
        }

        function changeStyle(event) {
            var target = $(event.target);
            var completed = target.prop('checked') ? 1 : 0;
            var $ndLi = target.parents('li');
            var todoItemId = encodeURIComponent(replaceId($ndLi.attr('id')));

            console.log(todoItemId);
            $ndLi.find('span').toggleClass('todo__item__complete');
            $.get('/cakephp-2.3.7/todos/complete/' + todoItemId + '/' + completed, null, function(response) {
                update();
                setClearButtonDisplay();
            });
            
        }

        function deleteTodoItem(event) {
            var target = $(event.target);
            event.preventDefault();

            var $ndLi = target.parents('li');
            var todoItemId = encodeURIComponent(replaceId($ndLi.attr('id')));

            $ndLi.remove();
            $.get('/cakephp-2.3.7/todos/delete/' + todoItemId, null, function(response) {
                update();
                setFooterDisplay();
                setClearButtonDisplay();
            });
        }
    }

    editTodoItem = function(element) {

        var $inputElement = element.parent('div').next();
        var displayValue = element.text();
        
        // Element will be displayed in the edit box to replace
        element.parent('div').hide()
                    .next()
                    .val(displayValue)
                    .show()
                    .focus();

        function changeText() {
            // Enter the text in the edit box is displayed
            element.text($inputElement.val())
                    .parent('div').show()
                    .next()
                    .hide();

            var todoItemId = encodeURIComponent(replaceId(element.parents('li').attr('id')));
            $.post('/cakephp-2.3.7/todos/edit/' + todoItemId, 'data[content]=' + $inputElement.val(), function(response) {});
        }

        $inputElement.blur(function(event) {
            changeText();
        }).keydown(function(event) {
            if (event.keyCode == 13) {
                changeText();
            }
        });
    }

    clearAllComplete = function() {

        // clear all completed todoItem
        $ndTodoClearComplete.click(function(event) {
            var $todoLists = $ndTodoList.find('li input:checked').parents('li');

            for (var i=0; i<$todoLists.length; i++) {
                $todoLists[i].remove();
                $.get('/cakephp-2.3.7/todos/delete/' + replaceId($todoLists[i].id), null, function(response) {
                    if (response.status == true) {
                        update();
                        setClearButtonDisplay();
                        setFooterDisplay();
                    }
                });
            }
        });
    }

    selectAll = function() {

        // select all button to add an event
        $ndTodoSelectAll.click(function(event) {
            var target = $(event.target);

            var $todoLists = $ndTodoList.find('li');
            var completed = target.prop('checked') ? 1 : 0;

            for (var i=0; i<$todoLists.length; i++) {

                if (completed) {
                    $($todoLists[i]).find('input[type=checkbox]')
                                .prop('checked', completed)
                                .next()
                                .addClass('todo__item__complete');
                } else {
                    $($todoLists[i]).find('input[type=checkbox]')
                                .prop('checked', completed)
                                .next()
                                .removeClass('todo__item__complete');
                }
                
                $.get('/cakephp-2.3.7/todos/complete/' + replaceId($todoLists[i].id) + '/' + completed, null, function(response) {
                    if (response.status == true) {
                        update();
                        setClearButtonDisplay();
                    }
                });
            }
        });
    }

    // set footer display
    setFooterDisplay = function() {
        var $lis = $ndTodoList.find('li');
        if ($lis.length == 0) {
            $ndFooter.hide();
            $ndTodoSelectAll.hide();
        } else {
            $ndFooter.show();
            $ndTodoSelectAll.show();
        }
    }

    // set clear button display
    setClearButtonDisplay = function() {
        if ($ndTodoList.find('li').find('input:checked').length > 0) {
            $ndTodoClearComplete.show();
        } else {
            $ndTodoClearComplete.hide();
        }
    }

    // update data 
    update = function() {
        var $lis = $ndTodoList.find('li');
        todoListComplete = $ndTodoList.find('input:checked').parents('li').length;

        $ndTodoListLength.text($lis.length - todoListComplete);
        $ndTodoListCompleteLength.text(todoListComplete);

        if (todoListComplete == $lis.length) {
            $ndTodoSelectAll.find('input[type=checkbox]')
                                .prop('checked', true);
        } else {
            $ndTodoSelectAll.find('input[type=checkbox]')
                                .prop('checked', false);
        }
    }

    replaceId = function(element) {
        return element.replace(TODO_ID_PREFIX, '');
    }

    initTodo();
})
