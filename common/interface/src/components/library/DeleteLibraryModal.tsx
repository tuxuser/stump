import { Trash } from 'phosphor-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import {
	MenuItem,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from '@chakra-ui/react';
import { useLibraryMutation } from '@stump/client';

import Button, { ModalCloseButton } from '../../ui/Button';

import type { Library } from '@stump/client';
interface Props {
	disabled?: boolean;
	library: Library;
}

// TODO: custom tabs, active state is atrocious
export default function DeleteLibraryModal({ disabled, library }: Props) {
	const navigate = useNavigate();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const { deleteLibraryAsync } = useLibraryMutation({
		onDeleted() {
			onClose();
			navigate('/');
		},
	});

	function handleDelete() {
		if (disabled) {
			// This should never happen, but here just in case
			throw new Error('You do not have permission to delete libraries.');
		} else {
			toast.promise(deleteLibraryAsync(library.id), {
				loading: 'Deleting Library...',
				success: 'Library Deleted!',
				error: 'Error Deleting Library',
			});
		}
	}

	function handleOpen() {
		if (!disabled) {
			onOpen();
		}
	}

	return (
		<>
			<MenuItem disabled={disabled} icon={<Trash size={'1rem'} />} onClick={handleOpen}>
				Delete
			</MenuItem>

			<Modal
				isCentered
				size={{ base: 'sm', sm: 'xl' }}
				isOpen={disabled ? false : isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Delete {library.name}</ModalHeader>
					<ModalCloseButton />
					<ModalBody className="flex flex-col space-y-2">
						<p>Are you sure you want to delete this library?</p>

						<p className="font-bold">This action cannot be undone.</p>
					</ModalBody>

					<ModalFooter>
						<Button mr={3} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme="red" onClick={handleDelete}>
							Delete
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
