import { Box, Select, Spinner, TextInput, Text, DataTable, CheckBox } from 'grommet';
import { orderBy } from 'lodash';
import { useState, useEffect, useMemo, useContext } from 'react';
import { CruiseContext } from '@/context/CruiseContext';

/**
 * Notes
 * - API isn't paginated and barfs out ~1400 results - a custom in-house API should support pagination via limit and offset
 * - unclear which props of the cruise objects should be displayed in the table so i'm choosing a few that seem most relevant (related: i don't
 * see a clear name or title type of prop that distinguishes each cruise from the others?)
 * - unclear if i need to include rejected and under review cruises as well so i'm just gonna fetch them as well /shrug
 */

type SortType = 'Newest' | 'Oldest';

const Cruises = () => {
  const { cruises, isLoading } = useContext<{ cruises: Cruise[]; isLoading: boolean; }>(CruiseContext);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [sortType, setSortType] = useState<SortType>('Newest');
  const aggregateTotalArea: number = useMemo(() => {
    return cruises.reduce((total: number, cruise: Cruise) => total + (cruise.total_area && cruise.total_area !== 'NaN' ? parseInt(cruise.total_area) : 0), 0);
  }, [cruises.length]);
  const filteredSortedCruises = useMemo(() => {
    // Don't run the filter if there's no need to (aka if there's no query)
    const filteredCruises = filterQuery ? cruises.filter((cruise: Cruise) => cruise.entry_id.toLowerCase().includes(filterQuery.toLowerCase())) : cruises;
    return orderBy(filteredCruises, [(cruise: Cruise) => new Date(cruise.created)], [sortType === 'Newest' ? 'desc' : 'asc']);
  }, [cruises, filterQuery, sortType]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box pad="24px" gap="18px">
      <Box direction="row" align="center" justify="between">
        <Box direction="row" align="center" justify="start" gap="8px">
          <Select
            options={['Newest', 'Oldest']}
            value={sortType}
            onChange={({ option }) => setSortType(option)}
          />

          <Box>
            <TextInput
              onChange={({ target }) => setFilterQuery(target.value)}
              placeholder="Search by Entry ID..."
              value={filterQuery}
            />
          </Box>

        </Box>
        <Text>
          Aggregate Total Area: {aggregateTotalArea}
        </Text>
      </Box>

      <DataTable
        columns={[
          {
            property: 'entry_id',
            header: 'Entry ID',
          },
          {
            property: 'device_make',
            header: 'Make',
          },
          {
            property: 'device_model',
            header: 'Model',
          },
          {
            property: 'year',
            header: 'Year',
            render: datum => parseInt(datum.year) || '-',
          },
          {
            property: 'created',
            header: 'Created',
            render: datum => (
              <Box pad={{ vertical: 'xsmall' }}>
                {new Date(datum.created).toDateString()}
              </Box>
            ),
          },
          {
            property: 'is_rejected',
            header: 'Is Rejected',
            render: datum => (
              <Box>
                {datum.is_rejected === 't' ? 'Yes' : 'No'}
              </Box>
            )
          },
          {
            property: 'total_area',
            header: 'Total Area',
            render: datum => datum.total_area || '-',
          },
        ]}
        data={filteredSortedCruises}
      />

      {filteredSortedCruises.length === 0 && (
        <Box pad="8px">
          <Text>
            No cruises matching filter
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Cruises;
