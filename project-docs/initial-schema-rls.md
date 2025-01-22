# Database Schema and Row Level Security

## Table Schema

### Comments Table
| Column Name | Data Type | Is Nullable |
|------------|-----------|-------------|
| id | uuid | NO |
| ticket_id | uuid | NO |
| author_id | uuid | NO |
| content | text | NO |
| created_at | timestamp with time zone | YES |

### Profiles Table
| Column Name | Data Type | Is Nullable |
|------------|-----------|-------------|
| id | uuid | NO |
| user_id | uuid | NO |
| full_name | text | YES |
| role | text | NO |
| created_at | timestamp with time zone | YES |

### Tickets Table
| Column Name | Data Type | Is Nullable |
|------------|-----------|-------------|
| id | uuid | NO |
| created_by | uuid | NO |
| assigned_to | uuid | YES |
| title | text | NO |
| description | text | YES |
| status | text | NO |
| created_at | timestamp with time zone | YES |

## Row Level Security (RLS) Policies

### Profiles Table Policies
| Policy Name | Schema | Command | Roles | Using Qual | With Check |
|------------|---------|---------|-------|------------|------------|
| Profiles select for all | public | SELECT | {public} | true | |
| Profiles insert for all | public | INSERT | {public} | | true |
| Profiles update for all | public | UPDATE | {public} | true | true |
| Profiles delete for all | public | DELETE | {public} | true | |

### Tickets Table Policies
| Policy Name | Schema | Command | Roles | Using Qual | With Check |
|------------|---------|---------|-------|------------|------------|
| Tickets select for all | public | SELECT | {public} | true | |
| Tickets insert for all | public | INSERT | {public} | | true |
| Tickets update for all | public | UPDATE | {public} | true | true |
| Tickets delete for all | public | DELETE | {public} | true | |

### Comments Table Policies
| Policy Name | Schema | Command | Roles | Using Qual | With Check |
|------------|---------|---------|-------|------------|------------|
| Comments select for all | public | SELECT | {public} | true | |
| Comments insert for all | public | INSERT | {public} | | true |
| Comments update for all | public | UPDATE | {public} | true | true |
| Comments delete for all | public | DELETE | {public} | true | | 