import 'package:arsus/views/theme/upload_media.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:flutter/material.dart';

import '../ine_success_page_widget.dart';
import 'INEValidatorService.dart';

class INEApiCaller {
  final INEValidatorService _ineValidatorService;

  INEApiCaller(this._ineValidatorService);

  Future<void> validate(Map<String, dynamic> stateContext) async {
    Map<String, dynamic> ineValidatorResponse = await this
        ._ineValidatorService
        .validate(stateContext["obverseUrl"], stateContext["backUrl"]);
    if (ineValidatorResponse["error"] != null) {
      return showUploadMessage(
          stateContext["buildContext"], ineValidatorResponse["error"],
          showLoading: false);
    }
    return await Navigator.push(
      stateContext["buildContext"],
      MaterialPageRoute(
        builder: (context) => INESuccessPageWidget(
            isValidINE: ineValidatorResponse["isValidINE"],
            url: ineValidatorResponse["isValidINE"]),
      ),
    );
  }
}
