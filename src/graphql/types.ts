import { DocumentNode } from 'graphql';

export interface Query<Response, Variable> {
    readonly query: DocumentNode;
}
