import 'dart:typed_data';

import 'package:arsus/views/theme/upload_media.dart';
import 'package:arsus/services/backend/firebase_storage/storage.dart';
import 'package:flutter/material.dart';

abstract class INEUploaderState {
  Future<Map<String, dynamic>> upload(Map<String, dynamic> stateContext);
}
