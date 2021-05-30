import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:rxdart/rxdart.dart';

import 'firestore_paginator_creator.dart';

class FirestorePagination {
  FirestorePaginationCreator firestorePaginationCreator;

  bool showIndicator = false;
  List<DocumentSnapshot> documentList;

  BehaviorSubject<List<DocumentSnapshot>> paginator;

  BehaviorSubject<bool> indicatorController;

  FirestorePagination() {
    paginator = BehaviorSubject<List<DocumentSnapshot>>();
    indicatorController = BehaviorSubject<bool>();
    firestorePaginationCreator = FirestorePaginationCreator();
  }

  Stream get getShowIndicatorStream => indicatorController.stream;

  Stream<List<DocumentSnapshot>> get stream => paginator.stream;

/*This method will automatically fetch first 10 elements from the document list */
  Future fetchFirstList() async {
    try {
      documentList = await firestorePaginationCreator.fetchFirstList();
      paginator.sink.add(documentList);
      try {
        if (documentList.length == 0) {
          paginator.sink.addError("No Data Available");
        }
      } catch (e) {}
    } on SocketException {
      paginator.sink.addError(SocketException("No Internet Connection"));
    } catch (e) {
      paginator.sink.addError(e);
    }
  }

  fetchNext() async {
    try {
      updateIndicator(true);
      List<DocumentSnapshot> newDocumentList =
      await firestorePaginationCreator.fetchNextList(documentList);
      documentList.addAll(newDocumentList);
      paginator.sink.add(documentList);
      try {
        if (documentList.length == 0) {
          paginator.sink.addError("No Data Available");
          updateIndicator(false);
        }
      } catch (e) {
        updateIndicator(false);
      }
    } on SocketException {
      paginator.sink.addError(SocketException("No Internet Connection"));
      updateIndicator(false);
    } catch (e) {
      updateIndicator(false);
      paginator.sink.addError(e);
    }
  }

/*For updating the indicator below every list and paginate*/
  updateIndicator(bool value) async {
    showIndicator = value;
    indicatorController.sink.add(value);
  }

  void dispose() {
    paginator.close();
    indicatorController.close();
  }
}
