import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# process data
pet_data = pd.read_csv('../train.csv')

hour_counts = pet_data.groupby(['AnimalType', 'OutcomeType', 'Hour']).count().reset_index().iloc[:,:4]

# init plot area
fig, axes = plt.subplots(nrows=1, ncols=2, sharex=True, sharey=True)
# assign data to plots
labels=[]
for OutcomeType_split,intermediate in hour_counts.groupby(['OutcomeType']):
    for idxAnimal, (AnimalType_split, data) in enumerate(intermediate.groupby(['AnimalType'])):
        current_ax = axes[idxAnimal]
        current_ax.stackplot(data['Hour'], data['AnimalID'])
        current_ax.set_xticks(np.arange(0,22,step=2))
        current_ax.set_xlabel('Hour of Day')
        if idxAnimal==0:
            current_ax.set_ylabel('Number by Outcome-Type', size=14)
            current_ax.set_title('Cats')
        else:
            current_ax.set_title('Dogs')
    labels.append(OutcomeType_split)
fig.legend(labels=labels, ncol=5, loc="lower center")
fig.suptitle('Number of cats/dogs by hour of day and split by Outcome-Type', fontsize=16)
fig.subplots_adjust(bottom=0.13)  # so that labels don't clash with legend




