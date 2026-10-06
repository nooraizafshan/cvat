# Copyright (C) CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

from django.urls import path

from .views import AnnotationCountView

urlpatterns = [
    path("annotations/count", AnnotationCountView.as_view(), name="annotation-count"),
]
