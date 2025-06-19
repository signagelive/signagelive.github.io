$(document).ready(function () {
  self.screens = ["HDMI-1", "HDMI-2"];
  var option = "";
  for (var i = 0; i < timezones.length; i++) {
    option +=
      '<option value="' +
      timezones[i].bsid +
      '">' +
      timezones[i].displayName +
      "</option>";
  }
  $("#timezoneList").append(option);
  $("#timezoneList > option").eq(32).attr("selected", "selected");
});

$("#multipleOutputEnabled").change(function () {
  if ($("#multipleOutputEnabled").val() == "No") {
    $("#audioChannelControl").attr("hidden", true);
    $("#audioEnabledControl").attr("hidden", false);
    $("#globalAudioEnabledControl").attr("hidden", false);
    $("#screen1AudioEnabledControl").attr("hidden", true);
    loadDefaultConfigurationOptions();
    resetResolutionOptions();
    resetOutputOptions();
  } else {
    $("#audioChannelControl").attr("hidden", false);
    $("#audioEnabledControl").attr("hidden", true);
    $("#globalAudioEnabledControl").attr("hidden", true);
    $("#screen1AudioEnabledControl").attr("hidden", false);
    loadMultiScreenConfigurationOptions();
    
    // Check if LGUV5N is selected and restrict resolution options if needed
    if ($("#multipleOutputDevice").val() == "LGUV5N") {
      restrictResolutionOptions();
      restrictOutputOptions();
    }
  }
});

$("#kioskModeEnabled").change(function () {
  if ($("#kioskModeEnabled").is(":checked"))
    $("#inactivityTimeout").prop("disabled", false);
  else $("#inactivityTimeout").prop("disabled", true);
});

$("#multipleOutputDevice").change(function () {
  loadMultiScreenConfigurationOptions();
  
  // Handle LGUV5N device special case - restrict resolution options
  if ($("#multipleOutputDevice").val() == "LGUV5N") {
    restrictResolutionOptions();
    restrictOutputOptions();
  } else {
    resetResolutionOptions();
    resetOutputOptions();
  }
});

$("#mode").change(function () {
  var selectedItem = $("#mode")[0].selectedIndex;

  if (selectedItem == 0) {
    $("#ipAddress").prop("disabled", true);
    $("#subnet").prop("disabled", true);
    $("#gateway").prop("disabled", true);
    $("#dns1").prop("disabled", true);
    $("#dns2").prop("disabled", true);
  } else {
    $("#ipAddress").prop("disabled", false);
    $("#subnet").prop("disabled", false);
    $("#gateway").prop("disabled", false);
    $("#dns1").prop("disabled", false);
    $("#dns2").prop("disabled", false);
  }
});

$("#connection").change(function () {
  var selectedItem = $("#connection")[0].selectedIndex;

  if (selectedItem == 0) {
    $("#ssid").prop("disabled", true);
    $("#passphrase").prop("disabled", true);
  } else {
    $("#ssid").prop("disabled", false);
    $("#passphrase").prop("disabled", false);
  }
});

$("#videomodeScreen1").change(function () {
  var selectedItem = $("#videomodeScreen1")[0].selectedIndex;

  if (selectedItem == 0) {
    $("#colorspaceScreen1").prop("disabled", true);
    $("#bitdepthScreen1").prop("disabled", true);
  } else {
    $("#colorspaceScreen1").prop("disabled", false);
    $("#bitdepthScreen1").prop("disabled", false);
  }
});

$("#videomodeScreen2").change(function () {
  var selectedItem = $("#videomodeScreen2")[0].selectedIndex;

  if (selectedItem == 0) {
    $("#colorspaceScreen2").prop("disabled", true);
    $("#bitdepthScreen2").prop("disabled", true);
  } else {
    $("#colorspaceScreen2").prop("disabled", false);
    $("#bitdepthScreen2").prop("disabled", false);
  }
});

$("#videomodeScreen3").change(function () {
  var selectedItem = $("#videomodeScreen3")[0].selectedIndex;

  if (selectedItem == 0) {
    $("#colorspaceScreen3").prop("disabled", true);
    $("#bitdepthScreen3").prop("disabled", true);
  } else {
    $("#colorspaceScreen3").prop("disabled", false);
    $("#bitdepthScreen3").prop("disabled", false);
  }
});

$("#videomodeScreen4").change(function () {
  var selectedItem = $("#videomodeScreen4")[0].selectedIndex;

  if (selectedItem == 0) {
    $("#colorspaceScreen4").prop("disabled", true);
    $("#bitdepthScreen4").prop("disabled", true);
  } else {
    $("#colorspaceScreen4").prop("disabled", false);
    $("#bitdepthScreen4").prop("disabled", false);
  }
});

$("#enabledScreen1").change(function () {
  var checked = $("#enabledScreen1").is(":checked");
  var videoModeselectedItem = $("#videomodeScreen1")[0].selectedIndex;
  var selectedItem = $("#audioChannel").val();

  if (!checked) {
    $("#rotationScreen1").prop("disabled", true);
    $("#colorspaceScreen1").prop("disabled", true);
    $("#bitdepthScreen1").prop("disabled", true);
    $("#videomodeScreen1").prop("disabled", true);
    $("#screenXScreen1").prop("disabled", true);
    $("#screenYScreen1").prop("disabled", true);
    $("#audioScreen1").prop("disabled", true);
    $("#audioScreen1").prop("checked", false);
  } else {
    $("#rotationScreen1").prop("disabled", false);
    $("#videomodeScreen1").prop("disabled", false);
    $("#screenXScreen1").prop("disabled", false);
    $("#screenYScreen1").prop("disabled", false);

    if (selectedItem === "hdmi") {
      $("#audioScreen1").prop("disabled", false);
      $("#audioScreen1").prop("checked", true);
    }

    if (videoModeselectedItem == 0) {
      $("#colorspaceScreen1").prop("disabled", true);
      $("#bitdepthScreen1").prop("disabled", true);
    } else {
      $("#colorspaceScreen1").prop("disabled", false);
      $("#bitdepthScreen1").prop("disabled", false);
    }
  }
});

$("#enabledScreen2").change(function () {
  var checked = $("#enabledScreen2").is(":checked");
  var videoModeselectedItem = $("#videomodeScreen2")[0].selectedIndex;
  var selectedItem = $("#audioChannel").val();

  if (!checked) {
    $("#rotationScreen2").prop("disabled", true);
    $("#colorspaceScreen2").prop("disabled", true);
    $("#bitdepthScreen2").prop("disabled", true);
    $("#videomodeScreen2").prop("disabled", true);
    $("#screenXScreen2").prop("disabled", true);
    $("#screenYScreen2").prop("disabled", true);
    $("#audioScreen2").prop("disabled", true);
    $("#audioScreen2").prop("checked", false);
  } else {
    $("#rotationScreen2").prop("disabled", false);
    $("#videomodeScreen2").prop("disabled", false);
    $("#screenXScreen2").prop("disabled", false);
    $("#screenYScreen2").prop("disabled", false);

    if (selectedItem === "hdmi") {
      $("#audioScreen2").prop("disabled", false);
      $("#audioScreen2").prop("checked", true);
    }

    if (videoModeselectedItem == 0) {
      $("#colorspaceScreen2").prop("disabled", true);
      $("#bitdepthScreen2").prop("disabled", true);
    } else {
      $("#colorspaceScreen2").prop("disabled", false);
      $("#bitdepthScreen2").prop("disabled", false);
    }
  }
});

$("#enabledScreen3").change(function () {
  var checked = $("#enabledScreen3").is(":checked");
  var videoModeselectedItem = $("#videomodeScreen3")[0].selectedIndex;
  var selectedItem = $("#audioChannel").val();

  if (!checked) {
    $("#rotationScreen3").prop("disabled", true);
    $("#colorspaceScreen3").prop("disabled", true);
    $("#bitdepthScreen3").prop("disabled", true);
    $("#videomodeScreen3").prop("disabled", true);
    $("#screenXScreen3").prop("disabled", true);
    $("#screenYScreen3").prop("disabled", true);
    $("#audioScreen3").prop("disabled", true);
    $("#audioScreen3").prop("checked", false);
  } else {
    $("#rotationScreen3").prop("disabled", false);
    $("#videomodeScreen3").prop("disabled", false);
    $("#screenXScreen3").prop("disabled", false);
    $("#screenYScreen3").prop("disabled", false);

    if (selectedItem === "hdmi") {
      $("#audioScreen3").prop("disabled", false);
      $("#audioScreen3").prop("checked", true);
    }

    if (videoModeselectedItem == 0) {
      $("#colorspaceScreen3").prop("disabled", true);
      $("#bitdepthScreen3").prop("disabled", true);
    } else {
      $("#colorspaceScreen3").prop("disabled", false);
      $("#bitdepthScreen3").prop("disabled", false);
    }
  }
});

$("#enabledScreen4").change(function () {
  var checked = $("#enabledScreen4").is(":checked");
  var videoModeselectedItem = $("#videomodeScreen4")[0].selectedIndex;
  var selectedItem = $("#audioChannel").val();

  if (!checked) {
    $("#rotationScreen4").prop("disabled", true);
    $("#colorspaceScreen4").prop("disabled", true);
    $("#bitdepthScreen4").prop("disabled", true);
    $("#videomodeScreen4").prop("disabled", true);
    $("#screenXScreen4").prop("disabled", true);
    $("#screenYScreen4").prop("disabled", true);
    $("#audioScreen4").prop("disabled", true);
    $("#audioScreen4").prop("checked", false);
  } else {
    $("#rotationScreen4").prop("disabled", false);
    $("#videomodeScreen4").prop("disabled", false);
    $("#screenXScreen4").prop("disabled", false);
    $("#screenYScreen4").prop("disabled", false);

    if (selectedItem === "hdmi") {
      $("#audioScreen4").prop("disabled", false);
      $("#audioScreen4").prop("checked", true);
    }

    if (videoModeselectedItem == 0) {
      $("#colorspaceScreen4").prop("disabled", true);
      $("#bitdepthScreen4").prop("disabled", true);
    } else {
      $("#colorspaceScreen4").prop("disabled", false);
      $("#bitdepthScreen4").prop("disabled", false);
    }
  }
});

$("#audioChannel").change(function () {
  var selectedItem = $("#audioChannel").val();

  if (selectedItem !== "hdmi") {
    $("#audioScreen1").prop("disabled", true).prop("checked", false);
    $("#audioScreen2").prop("disabled", true).prop("checked", false);
    $("#audioScreen3").prop("disabled", true).prop("checked", false);
    $("#audioScreen4").prop("disabled", true).prop("checked", false);
    $("#audioScreen5").prop("disabled", true).prop("checked", false);
  } else {
    self.screens.forEach(function (screen, ind) {
      if ($("#enabledScreen" + (ind + 1)).is(":checked")) {
        $("#audioScreen" + (ind + 1)).prop("disabled", false);
      } else {
        $("#audioScreen" + (ind + 1)).prop("disabled", true);
      }
    });
  }
});

$("#generateNetworkConfig").click(function () {
  var selectedTz = $("#timezoneList")[0].selectedIndex;

  var settings = new Object();
  settings.networkConfigured = true;
  settings.use_dhcp = true;
  settings.ipv4_address = null;
  settings.subnet_mask = null;
  settings.default_gateway = null;
  settings.dns1 = null;
  settings.dns2 = null;
  settings.use_wifi = false;
  settings.proxy_server = null;
  settings.wifi_network_name = null;
  settings.wifi_pass_phrase = null;
  settings.wifi_security_type = null;
  settings.proxy_server = null;
  settings.time_server = null;

  var selectedItem = $("#mode")[0].selectedIndex;

  if (selectedItem == 1) {
    settings.use_dhcp = false;
    settings.ipv4_address = $("#ipAddress").val();
    settings.subnet_mask = $("#subnet").val();
    settings.default_gateway = $("#gateway").val();
    settings.dns1 = $("#dns1").val();
    settings.dns2 = $("#dns2").val();
  }

  selectedItem = $("#connection")[0].selectedIndex;
  if (selectedItem == 1) {
    settings.use_wifi = true;
    settings.wifi_network_name = $("#ssid").val();
    settings.wifi_pass_phrase = $("#passphrase").val();
  }

  var proxy = $("#proxy").val();

  if (proxy && proxy != "") {
    settings.proxy_server = proxy;
  }

  var timeserver = $("#timeserver").val();

  if (timeserver && timeserver != "") {
    settings.time_server = timeserver;
  } else {
    settings.time_server = "ntp://time.brightsignnetwork.com";
  }

  download("network.json", JSON.stringify(settings));
});

$("#generate").click(function () {
  var selectedTz = $("#timezoneList")[0].selectedIndex;

  var settings = new Object();

  settings.showTrace = false;
  if ($("#multipleOutputEnabled").val() == "No") {
    settings.isMuted = !$("#audioEnabled").is(":checked");

    settings.rotation = new Object();
    settings.rotation.displayName = "No rotation";
    settings.rotation.angle = 0;
    settings.rotation.id = 0;

    var rotation = $("#rotationScreen1").val();

    if (rotation == 90) {
      settings.rotation.displayName = "Portrait";
      settings.rotation.angle = 90;
      settings.rotation.id = 90;
    } else if (rotation == 270) {
      settings.rotation.displayName = "'Portrait (270)";
      settings.rotation.angle = 270;
      settings.rotation.id = 270;
    }

    settings.videoMode = new Object();
    settings.videoMode.resolution = $("#videomodeScreen1").val();

    if (settings.videoMode.resolution == "auto") {
      settings.videoMode.colorSpace = "rgb";
      settings.videoMode.bitDepth = 8;
    } else {
      settings.videoMode.colorSpace = $("#colorspaceScreen1").val();
      settings.videoMode.bitDepth = parseInt($("#bitdepthScreen1").val());
    }
  } else {
    settings.isMuted = $("#audioChannel").val() === "none";

    settings.rotation = new Object();
    settings.rotation.displayName = "Custom rotation";
    settings.rotation.angle = 0;

    settings.screenConfig = new Array();

    if ($("#multipleOutputDevice").val() == "XC4055") {
      self.screens = ["HDMI-1", "HDMI-2", "HDMI-3", "HDMI-4"];
    } else if ($("#multipleOutputDevice").val() == "XC2055" || $("#multipleOutputDevice").val() == "XT2145") {
      self.screens = ["HDMI-1", "HDMI-2"];
    } else {
      self.screens = ["HDMI-1"];
    }

    self.screens.forEach(function (screen, ind) {
      if ($("#enabledScreen" + (ind + 1)).is(":checked")) {
        settings.screenConfig[ind] = {
          enabled: $("#enabledScreen" + (ind + 1)).is(":checked"),
          outputName: screen,
          screenX: Number($("#screenXScreen" + (ind + 1)).val()),
          screenY: Number($("#screenYScreen" + (ind + 1)).val()),
          transform: $("#rotationScreen" + (ind + 1)).val(),
          videoMode: $("#videomodeScreen" + (ind + 1)).val(),
        };

        if (settings.screenConfig[ind].transform == 0) {
          settings.screenConfig[ind].transform = "normal";
        }
      } else {
        settings.screenConfig[ind] = {
          enabled: $("#enabledScreen" + (ind + 1)).is(":checked"),
          outputName: screen,
        };
      }
    });

    // audio settings object
    settings.audio = new Object();
    settings.audio.globalAudioChannel = $("#audioChannel").val();
    settings.audio.discreetAudioChannels = [];
    self.screens.forEach(function (screen, ind) {
      if ($("#audioScreen" + (ind + 1)).is(":checked")) {
        settings.audio.discreetAudioChannels.push(screen);
      }
    });
  }

  settings.timeZone = new Object();
  settings.timeZone.displayName = timezones[selectedTz].displayName;
  settings.timeZone.bsid = timezones[selectedTz].bsid;
  settings.timeZone.id = timezones[selectedTz].id;
  settings.modules = new Object();
  settings.remoteFirmwareUpdates = new Object();
  settings.remoteFirmwareUpdates.enabled = false;
  settings.remoteFirmwareUpdates.configured = false;

  settings.videoTransparency = new Object();
  settings.videoTransparency.enabled = $("#transparencyEnabled").is(":checked");

  if ($("#kioskModeEnabled").is(":checked"))
    $("#inactivityTimeout").prop("disabled", false);
  else $("#inactivityTimeout").prop("disabled", true);

  settings.interactiveKiosk = new Object();
  settings.interactiveKiosk.enabled = $("#kioskModeEnabled").is(":checked");
  settings.interactiveKiosk.idleIntervalInSeconds = parseInt(
    $("#inactivityTimeout").val()
  );

  // Gapless Widget Transitions
  settings.gaplessWidgetTransitions = $("#gaplessWidgetTransitionsEnabled").is(":checked");

  // Always Embed Webpages
  settings.alwaysEmbedWebpages = new Object();
  settings.alwaysEmbedWebpages.enabled = $("#alwaysEmbedWebpagesEnabled").is(":checked");

  if (
    isNaN(settings.interactiveKiosk.idleIntervalInSeconds) ||
    settings.interactiveKiosk.idleIntervalInSeconds < 1
  )
    settings.interactiveKiosk.idleIntervalInSeconds = 15;

  settings.interactiveKiosk.trigger = new Object();
  settings.interactiveKiosk.trigger.key = "t";
  settings.interactiveKiosk.trigger.type = "KeyboardEvent";

  settings.ptp = {
    enabled: $('#ptpEnabled').is(":checked"),
    domain: String(parseInt($('#ptpDomain').val()))
  };
  
  download('settings.json', JSON.stringify(settings));

});

function download(filename, text) {
  if (window.navigator.msSaveOrOpenBlob) {
    var blob = new Blob([text], {
      type: "application/json",
    });
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}

function loadDefaultConfigurationOptions() {
  $("#screen1 .title").hide();
  $("#screen1 .Screen1Coords").hide();
  $("#outputDevice").hide();
  $("#screen2").hide();
  $("#screen3").hide();
  $("#screen4").hide();
}

function loadMultiScreenConfigurationOptions() {
  $("#screen1 .title").show();
  $("#screen1 .Screen1Coords").show();
  $("#outputDevice").show();
  
  if ($("#multipleOutputDevice").val() == "XC4055") {
    $("#screen2").show();
    $("#screen3").show();
    $("#screen4").show();
    self.screens = ["HDMI-1", "HDMI-2", "HDMI-3", "HDMI-4"];
  } else if ($("#multipleOutputDevice").val() == "XC2055" || $("#multipleOutputDevice").val() == "XT2145") {
    $("#screen2").show();
    $("#screen3").hide();
    $("#screen4").hide();
    self.screens = ["HDMI-1", "HDMI-2"];
  } else if ($("#multipleOutputDevice").val() == "LGUV5N") {
    $("#screen2").hide();
    $("#screen3").hide();
    $("#screen4").hide();
    self.screens = ["HDMI-1"];
  }
}

function restrictResolutionOptions() {
  for (let i = 1; i <= 4; i++) {
    const videomodeSelect = $(`#videomodeScreen${i}`);
    
    // Store the video mode options if not already stored
    if (!videomodeSelect.data('original-options')) {
      videomodeSelect.data('original-options', videomodeSelect.html());
    }
    
    // Replace with only the 3840x2160x60p option
    videomodeSelect.html('<option value="3840x2160x60p">3840x2160x60p</option>');
    
    if ($(`#enabledScreen${i}`).is(":checked")) {
      $(`#colorspaceScreen${i}`).prop('disabled', false);
      $(`#bitdepthScreen${i}`).prop('disabled', false);
    }
  }
}

function restrictOutputOptions() {
    // Disable enabledScreen1 for LGUV5N
    $("#enabledScreen1").prop("disabled", true).prop("checked", true);
}

function resetResolutionOptions() {
  // Restore original resolution options for screens 1-4
  for (let i = 1; i <= 4; i++) {
    const videomodeSelect = $(`#videomodeScreen${i}`);
    
    // Restore original options if they were stored
    if (videomodeSelect.data('original-options')) {
      videomodeSelect.html(videomodeSelect.data('original-options'));
    }
    
    // Reset disabled state based on selected item
    const selectedItem = videomodeSelect[0].selectedIndex;
    if (selectedItem == 0) {
      $(`#colorspaceScreen${i}`).prop('disabled', true);
      $(`#bitdepthScreen${i}`).prop('disabled', true);
    }
  }
}

function resetOutputOptions() {
  // Restore output options for screen 1
    $("#enabledScreen1").prop("disabled", false);
    $("#enabledScreen1").prop("checked", true);
}