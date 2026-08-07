"""
=========================================================
AeroTwin V2

Model Benchmarking Pipeline

=========================================================
"""

import time
import joblib
import pandas as pd

from sklearn.model_selection import GroupShuffleSplit

from config import *

from model_factory import get_models

from evaluate import evaluate_model


def benchmark_target(

    X,

    y,

    groups,

    target

):

    models = get_models()

    gss = GroupShuffleSplit(

        n_splits=1,

        test_size=TEST_SIZE,

        random_state=RANDOM_STATE

    )

    train_idx,test_idx = next(

        gss.split(

            X,

            y,

            groups

        )

    )

    X_train = X.iloc[train_idx]

    X_test = X.iloc[test_idx]

    y_train = y.iloc[train_idx]

    y_test = y.iloc[test_idx]

    train_groups = groups.iloc[train_idx]

    best_score = -999999

    best_model = None

    best_name = None

    summary=[]

    for name,model in models.items():

        print(f"\nTraining {name}")

        start=time.time()

        model.fit(

            X_train,

            y_train

        )

        training_time=time.time()-start

        results=evaluate_model(

            model=model,

            model_name=name,

            X_train=X_train,

            X_test=X_test,

            y_train=y_train,

            y_test=y_test,

            groups=train_groups,

            feature_names=X.columns.tolist(),

            target=f"{target}_{name}",

            training_time=training_time

        )

        summary.append(results)

        if results["R2"]>best_score:

            best_score=results["R2"]

            best_model=model

            best_name=name

    print("="*60)

    print(target)

    print(best_name)

    print(best_score)

    print("="*60)

    joblib.dump(

        best_model,

        MODEL_DIR/

        f"{target}_model.pkl"

    )

    pd.DataFrame(

        summary

    ).to_csv(

        REPORT_DIR/

        f"{target}_benchmark.csv",

        index=False

    )

    return{

        "Target":target,

        "BestModel":best_name,

        "BestR2":best_score

    }