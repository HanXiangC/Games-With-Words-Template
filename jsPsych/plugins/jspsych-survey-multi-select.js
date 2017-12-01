/**
 * jspsych-survey-multi-select
 * a jspsych plugin for multiple choice survey questions
 *
 * Shane Martin
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['survey-multi-select'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'survey-multi-select',
    description: '',
    parameters: {
      questions: {
        type: [jsPsych.plugins.parameterType.STRING],
        array: true,
        default: undefined,
        no_function: false,
        description: ''
      },
      options: {
        type: [jsPsych.plugins.parameterType.STRING],
        array: true,
        default: undefined,
        no_function: false,
        description: ''
      },
      required: {
        type: [jsPsych.plugins.parameterType.BOOL],
        array: true,
        default: false,
        no_function: false,
        description: ''
      },
      horitzontal: {
        type: [jsPsych.plugins.parameterType.BOOL],
        default: false,
        no_function: false,
        description: ''
      },
      preamble: {
        type: [jsPsych.plugins.parameterType.STRING],
        default: '',
        no_function: false,
        description: ''
      }
    }
  }
  plugin.trial = function(display_element, trial) {
    var plugin_id_name = "jspsych-survey-multi-select";
    var plugin_id_selector = '#' + plugin_id_name;
    var _join = function( /*args*/ ) {
      var arr = Array.prototype.slice.call(arguments, _join.length);
      return arr.join(separator = '-');
    }

    // trial defaults
    trial.preamble = typeof trial.preamble == 'undefined' ? "" : trial.preamble;
    trial.required = typeof trial.required == 'undefined' ? null : trial.required;
    trial.horizontal = typeof trial.required == 'undefined' ? false : trial.horizontal;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // inject CSS for trial
    var node = display_element.innerHTML += '<style id="jspsych-survey-multi-select-css">';
    var cssstr = ".jspsych-survey-multi-select-question { margin-top: 2em; margin-bottom: 2em; text-align: left; }"+
      ".jspsych-survey-multi-select-text span.required {color: darkred;}"+
      ".jspsych-survey-multi-select-horizontal .jspsych-survey-multi-select-text {  text-align: center;}"+
      ".jspsych-survey-multi-select-option { line-height: 2; }"+
      ".jspsych-survey-multi-select-horizontal .jspsych-survey-multi-select-option {  display: inline-block;  margin-left: 1em;  margin-right: 1em;  vertical-align: top;}"+
      "label.jspsych-survey-multi-select-text input[type='checkbox'] {margin-right: 1em;}"

    display_element.querySelector('#jspsych-survey-multi-select-css').innerHTML = cssstr;

    // form element
    var trial_form_id = _join(plugin_id_name, "form");
    display_element.innerHTML += '<form id="'+trial_form_id+'"></form>';
    var trial_form = display_element.querySelector("#" + trial_form_id);
    // show preamble text
    var preamble_id_name = _join(plugin_id_name, 'preamble');
    trial_form.innerHTML += '<div id="'+preamble_id_name+'" class="'+preamble_id_name+'">'+trial.preamble+'</div>';

    // add multiple-choice questions
    for (var i = 0; i < trial.questions.length; i++) {
      // create question container
      var question_classes = [_join(plugin_id_name, 'question')];
      if (trial.horizontal) {
        question_classes.push(_join(plugin_id_name, 'horizontal'));
      }
    
      trial_form.innerHTML += '<div id="'+_join(plugin_id_name, i)+'" class="'+question_classes.join(' ')+'"></div>';
    
      var question_selector = _join(plugin_id_selector, i);
    
      // add question text
      display_element.querySelector(question_selector).innerHTML += '<p id="survey-question" class="' + plugin_id_name + '-text survey-multi-select">' + trial.questions[i] + '</p>';

      // create option radio buttons
      for (var j = 0; j < trial.options[i].length; j++) {
        var option_id_name = _join(plugin_id_name, "option", i, j),
          option_id_selector = '#' + option_id_name;
    
        // add radio button container
        display_element.querySelector(question_selector).innerHTML += '<div id="'+option_id_name+'" class="'+_join(plugin_id_name, 'option')+'"></div>';
    
        // add label and question text
        var form = document.getElementById(option_id_name)
        var input_id_name = _join(plugin_id_name, 'response', i);
        var label = document.createElement('label');
        label.setAttribute('class', plugin_id_name+'-text');
        label.innerHTML = trial.options[i][j];
        label.setAttribute('for', input_id_name)

        // create  checkboxes
        var input = document.createElement('input');
        input.setAttribute('type', "checkbox");
        input.setAttribute('name', input_id_name);
        input.setAttribute('value', trial.options[i][j])
        form.appendChild(label)
        form.insertBefore(input, label)
      }
    }
    // add submit button
    trial_form.innerHTML +='<div class="fail-message"></div>'
    trial_form.innerHTML += '<input type="submit" id="'+plugin_id_name+'-next" class="'+plugin_id_name+' jspsych-btn" value="Next"></input>';
    
    trial_form.addEventListener('submit', function(event) {
      event.preventDefault();
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var matches = display_element.querySelectorAll("div." + plugin_id_name + "-question");
      var question_data = {};
      var val = [];
      matches.forEach(function(match, index) {
        var inputboxes = match.querySelectorAll("input[type=checkbox]:checked")
        inputboxes.forEach(currentChecked => {
          val.push(currentChecked.value)
        })
        var id = 'Q' + index
        var obje = {};
        obje[id] = val;
        Object.assign(question_data, obje);
      })
      if(!val.length) {
        var inputboxes = display_element.querySelectorAll("input[type=checkbox]")
        display_element.querySelector(".fail-message").innerHTML = '<span style="color: red;" class="required">*please select at least one option!</span>';
      } else {
        // save data
        var trial_data = {
          "rt": response_time,
          "responses": JSON.stringify(question_data)
        };
        display_element.innerHTML = '';
        
        // next trial
        jsPsych.finishTrial(trial_data);
      }
    });
    
    var startTime = (new Date()).getTime();
  };

  return plugin;
})();