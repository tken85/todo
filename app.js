$(document).ready(function(){
  toDo.init();

});

var toDo ={

  init : function(){
    toDo.initStyling();
    toDo.initEvents();

  },
  initStyling : function(){
    toDo.loadToDos(toDo.toDoList);
    toDo.setNumLeft();

  },
  initEvents : function(){
    //create new todo
    $('#newForm').on('submit', function(event){
      event.preventDefault();
      var newToDo ={
        item: $("input[name='newtodo']").val(),
        status: "Active",
      };
      toDo.toDoList.push(newToDo);
      var toDoId = toDo.toDoList.indexOf(newToDo);
      newToDo.id = toDoId;
      toDo.loadTemplate($('.todo-section'), newToDo, $('#toDoTmpl').html());
      $("input[name='newtodo']").val('');
      toDo.setNumLeft();
    });
    // edit a to do
    $('.active-list').on('submit', '.edit-form', function(event){
      event.preventDefault();
      var index = $(this).closest('article').data('id');
      var editResult = $(this).children('input').val();
      console.log(editResult);
      console.log(index);
      toDo.toDoList[index].item = editResult;
      $(this).toggleClass('invisible');
      $(this).siblings('section').toggleClass('invisible');
      $('.todo-section').html("");
      toDo.loadToDos(toDo.toDoList);
    });
    // filter for All
    $('#All').on('click', function(event){
      event.preventDefault();
      toDo.filterVisible("All");
      $(this).addClass('active_filter');
      $(this).siblings('li').removeClass('active_filter');
    });

    // filter for Active only
    $('#Active').on('click', function(event){
      event.preventDefault();
      toDo.filterVisible("Active");
      $(this).addClass('active_filter');
      $(this).siblings('li').removeClass('active_filter');
    });

    // filter for complete
    $('#Complete').on('click', function(event){
      event.preventDefault();
      toDo.filterVisible("Completed");
      $(this).addClass('active_filter');
      $(this).siblings('li').removeClass('active_filter');
    });
    //toggle complete and active statuses
    $('.active-list').on('click','span', function(event){
      event.preventDefault();
      $(this).siblings('section').toggleClass('strikethrough');
      var index = $(this).closest('article').data('id');
      console.log(index);
      if(toDo.toDoList[index].status === "Active"){
        toDo.toDoList[index].status = "Completed";
        $(this).html('&#10003;');
      }
      else{
        toDo.toDoList[index].status = "Active";
        $(this).text("");
      }
      toDo.setNumLeft();
    });
    // delete a to do
    $('.active-list').on('click','.delete', function(event){
      event.preventDefault();
      var toDoId = $(this).closest('article').data('id');
      toDo.deleteToDo(toDoId, $(this));
      toDo.setNumLeft();
    });

    // clear all completed
    $('.active-list').on('click','#clear',function(event){
      event.preventDefault();
      toDo.clearComplete();
    });
    // toggle edit on
    $('.active-list').on('dblclick', 'article section', function(event){
      $(this).toggleClass('invisible');
      $(this).siblings('form').toggleClass('invisible');
    });
  },
  loadTemplate : function($el, data, tmpl){
    var template = _.template(tmpl);
    var html = template(data);
    $el.append(html);
  },
  loadToDos : function(arr){
    _.each(arr, function(currVal, idx, arr){
      currVal.id = idx;
      if(currVal.status ==="Active"){
      toDo.loadTemplate($('.todo-section'), currVal, $('#toDoTmpl').html());
    }
    else{
      toDo.loadTemplate($('.todo-section'), currVal, $('#completeToDoTmpl').html());
    }
    });
  },
  filterVisible : function(status){
    $('.todo-section').html("");
    var filtered = [];
    if(status ==="All"){
      filtered = toDo.toDoList;
    }
    else{
    filtered = toDo.toDoList.filter(function(item){
      return item.status === status;
    });
  }
    toDo.loadToDos(filtered);
  },
  deleteToDo : function(idx, $el){
    toDo.toDoList.splice(idx,1);
    $('.todo-section').html('');
    toDo.loadToDos(toDo.toDoList);
  },
  clearComplete : function(){
    $('.todo-section').html("");
    var filtered =[];
    toDo.toDoList = toDo.toDoList.filter(function(item){
      return item.status === "Active";
    });
    //returns to all view to prevent rare instance of completed view showing an active
    $('#All').addClass('active_filter');
    $('#All').siblings('li').removeClass('active_filter');
    toDo.loadToDos(toDo.toDoList);
  },
  setNumLeft: function(){
    $('#num-left').html("");
    var numLeft = toDo.toDoList.filter(function(item){
      return item.status === "Active";
    }).length;
    if(numLeft === 1){
      $('#num-left').html(numLeft + " item left");
    }
    else{
      $('#num-left').html(numLeft + " items left");
    }
  },
  toDoList : [],

};

//localStorage.setItem('toDo', JSON.stringify(toDo));
