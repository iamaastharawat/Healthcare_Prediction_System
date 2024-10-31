import unittest
import numpy as np
import pandas as pd
import time
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix
from implementation.ml.train_model import best_model, X_test, y_test

class TestModel(unittest.TestCase):

    def test_model_accuracy(self):
        """Test if the model achieves at least 70% accuracy."""
        accuracy = best_model.score(X_test, y_test)
        print("Model accuracy: ", accuracy)
        print("\n")
        self.assertGreater(accuracy, 0.7, "Model accuracy should be greater than 70%")

    def test_model_precision(self):
        """Test if the model achieves at least 70% precision."""
        y_pred = best_model.predict(X_test)
        precision = precision_score(y_test, y_pred, average='weighted', zero_division=1)
        print("Model presision: ", precision)
        print("\n")
        self.assertGreater(precision, 0.7, "Precision should be greater than 70%")

    def test_model_recall(self):
        """Test if the model achieves at least 70% recall."""
        y_pred = best_model.predict(X_test)
        recall = recall_score(y_test, y_pred, average='weighted', zero_division=1)
        print("Model recall: ", recall)
        print("\n")
        self.assertGreater(recall, 0.7, "Recall should be greater than 70%")

    def test_model_f1_score(self):
        """Test if the model achieves at least 70% F1-score."""
        y_pred = best_model.predict(X_test)
        f1 = f1_score(y_test, y_pred, average='weighted', zero_division=1)
        print("Model f1 score: ", f1)
        print("\n")
        self.assertGreater(f1, 0.7, "F1-score should be greater than 70%")

    def test_inference_time(self):
        """Test if the model inference time is below 100ms per sample."""
        start_time = time.time()
        best_model.predict(X_test)
        total_time = time.time() - start_time
        avg_inference_time = (total_time / len(X_test)) * 1000  
        print("Model average inference time(ms): ", avg_inference_time)
        print("\n")
        self.assertLess(avg_inference_time, 100, "Inference time should be under 100ms per sample")

    def test_false_negative_rate(self):
        """Test if the false negative rate is below a certain threshold (e.g., 30%)."""
        y_pred = best_model.predict(X_test)
    
        cm = confusion_matrix(y_test, y_pred, labels=best_model.classes_)
    
        fnr_list = []
        for i in range(len(best_model.classes_)):
            fn = cm[i].sum() - cm[i][i]  
            tp = cm[i][i] 
            fnr = fn / (fn + tp) if (fn + tp) > 0 else 0 
            fnr_list.append(fnr)
            print(f"FNR for class '{best_model.classes_[i]}': {fnr:.2f}")

        overall_fnr = np.mean(fnr_list)
        print("Overall False Negative Rate: ", overall_fnr)
        print("\n")

        self.assertLess(overall_fnr, 0.3, "Overall False Negative Rate should be less than 30%")

if __name__ == '__main__':
    unittest.main()
