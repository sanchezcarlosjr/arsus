import 'package:arsus/views/apps/ine_page/ine_uploading/ImageUploaderFailState.dart';
import 'package:arsus/views/apps/ine_page/ine_uploading/ImageUploaderSuccessState.dart';
import 'package:arsus/views/apps/ine_page/ine_uploading/State.dart';
import 'package:arsus/views/theme/upload_media.dart';
import 'package:arsus/services/backend/firebase_storage/storage.dart';
import 'package:flutter/material.dart';

class ImageUploaderState extends INEUploaderState {
  @override
  Future<Map<String, dynamic>> upload(Map<String, dynamic> stateContext) async {
    showUploadMessage(stateContext["buildContext"], 'Subiendo imagen...',
        showLoading: true);
    stateContext["downloadUrl"] = await uploadData(
        stateContext["selectedMedia"].storagePath,
        stateContext["selectedMedia"].bytes);
    ScaffoldMessenger.of(stateContext["buildContext"]).hideCurrentSnackBar();
    return stateContext["downloadUrl"] != null
        ? ImageUploaderSuccessState().upload(stateContext)
        : ImageUploaderFailState().upload(stateContext);
  }
}
