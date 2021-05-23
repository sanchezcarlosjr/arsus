import 'package:arsus/views/apps/ine_page/ine_success_page_widget.dart';
import 'package:arsus/views/apps/ine_page/ine_uploading/State.dart';
import 'package:arsus/views/theme/upload_media.dart';
import 'package:flutter/material.dart';

class ImageUploaderFailState extends INEUploaderState {
  @override
  Future<Map<String, dynamic>> upload(Map<String, dynamic> stateContext) async {
    showUploadMessage(stateContext["buildContext"], 'Fallo la subida de la INE!');
    return stateContext;
  }
}
