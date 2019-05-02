import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

# process data
pet_data = pd.read_csv('../train.csv')
pet_data.OutcomeSubtype.fillna('Null',inplace=True)  #replace blanks with Null

Subtype_counts = pet_data.groupby(['AnimalType', 'OutcomeType','OutcomeSubtype']).count().iloc[:,:1]
Subtype_pct = Subtype_counts.groupby(level=['AnimalType', 'OutcomeType'])\
                    .apply(lambda x: x / float(x.sum())).reset_index()

SubtypeList = list(Subtype_pct['OutcomeSubtype'].unique())

# make color map
colorpicker = plt.cm.get_cmap('tab20', 17)
colorlist = [colorpicker(i/len(SubtypeList)) for i in range(len(SubtypeList))]
cmap = {i:j for i,j in zip(SubtypeList, colorlist)}

# make legend object
legnd = []
for label, color in cmap.items():
    patch = mpatches.Patch(color=color, label=label)
    legnd.append(patch)

# do the actual plotting
fig, axes = plt.subplots(nrows=2, ncols=5)
for idxOutcome, (OutcomeType_split,intermediate) in enumerate(Subtype_pct.groupby(['OutcomeType'])):
    for idxAnimal, (AnimalType_split, data) in enumerate(intermediate.groupby(['AnimalType'])):
        current_ax = axes[idxAnimal, idxOutcome]
        current_ax.pie(data['AnimalID'],
                       colors=[cmap[i] for i in data['OutcomeSubtype']],
                       autopct=lambda x: f"{x/100:.1%}" if x>5 else '')
        current_ax.set_title(OutcomeType_split)
        if idxOutcome==0:  # first pie
            if idxAnimal==0:  # for cats
                label = 'Cats'
            else:
                label = 'Dogs'
            current_ax.set_ylabel(label, fontsize=18)
fig.suptitle('% of cats/dogs for each Outcome-Type', fontsize=18)
fig.legend(handles=legnd, ncol=6, loc = "lower center")






