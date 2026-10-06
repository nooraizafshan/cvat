# Copyright (C) CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

from types import SimpleNamespace
from unittest import mock

from rest_framework.test import APIRequestFactory, force_authenticate

from cvat.apps.test.views import AnnotationCountView


class AnnotationCountViewTest:
    def setup_method(self):
        self.factory = APIRequestFactory()
        self.user = SimpleNamespace(is_authenticated=True)
        self.task = SimpleNamespace(id=17)

    def test_requires_authentication(self):
        request = self.factory.get("/api/annotations/count", {"task_id": 17})
        response = AnnotationCountView.as_view()(request)

        assert response.status_code in {401, 403}

    @mock.patch("cvat.apps.test.views.get_object_or_404")
    def test_rejects_unknown_annotation_type(self, get_object):
        get_object.return_value = self.task
        request = self.factory.get(
            "/api/annotations/count",
            {"task_id": 17, "annotation_type": "unknown"},
        )
        force_authenticate(request, user=self.user)

        with mock.patch("cvat.apps.test.views.TaskPermission") as permission_class:
            permission_class.create_scope_view.return_value.check_access.return_value.allow = True
            response = AnnotationCountView.as_view()(request)

        assert response.status_code == 400
        assert "annotation_type" in response.data["detail"]

    @mock.patch("cvat.apps.test.views.get_object_or_404")
    def test_combines_counts_by_label(self, get_object):
        get_object.return_value = self.task
        shape_model = mock.Mock()
        shape_model.objects.filter.return_value.values.return_value.annotate.return_value.order_by.return_value = [
            {"label__name": "car", "count": 2},
            {"label__name": "person", "count": 1},
        ]
        image_model = mock.Mock()
        image_model.objects.filter.return_value.values.return_value.annotate.return_value.order_by.return_value = [
            {"label__name": "car", "count": 3},
        ]
        request = self.factory.get("/api/annotations/count", {"task_id": 17})
        force_authenticate(request, user=self.user)

        with (
            mock.patch("cvat.apps.test.views.TaskPermission") as permission_class,
            mock.patch.object(
                AnnotationCountView,
                "annotation_models",
                {"shape": shape_model, "image": image_model},
            ),
        ):
            permission_class.create_scope_view.return_value.check_access.return_value.allow = True
            response = AnnotationCountView.as_view()(request)

        assert response.status_code == 200
        assert response.data["task_id"] == 17
        assert response.data["results"] == [
            {"label": "car", "count": 5},
            {"label": "person", "count": 1},
        ]
