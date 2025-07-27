import { DataSource } from 'typeorm';

export async function clearDatabase(dataSource: DataSource): Promise<void> {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    let query = `DELETE FROM ${entity.tableName}`;

    await dataSource.query(query);
    query = `DELETE FROM sqlite_sequence WHERE name='${entity.tableName}';`;
    await dataSource.query(query);
  }
}
