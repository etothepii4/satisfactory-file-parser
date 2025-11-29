import { WritableStream } from "stream/web";
import { SatisfactorySave } from '../../satisfactory/save/satisfactory-save';
import { SaveStreamWriter } from "./save-stream-writer.class";

/**
 * @deprecated use ReadableStreamParser instead.
 * simply streams a whole satisfactorySave without backpressure to Json.
 */
export class SaveStreamJsonStringifier {
	public static async StreamStringifySave(save: SatisfactorySave, output: WritableStream<string>): Promise<void> {
		const writer = new SaveStreamWriter(output.getWriter());

		await writer.beginSave();
		await writer.writeHeader(save.header);
		if (save.compressionInfo) {
			await writer.writeCompressionInfo(save.compressionInfo);
		}

		// save body validation
		await writer.writeSaveBodyValidation(save.saveBodyValidation);

		// stream level objects in batches.
		await writer.openLevels();
		const objectBatchSize = 10000;
		for (const level of Object.values(save.levels)) {
			await writer.openLevel(level.name);

			let i = 0;
			for (i; i < level.objects.length; i += objectBatchSize) {
				await writer.writeObjects(...level.objects.slice(i, Math.min(i + objectBatchSize, level.objects.length)));
			}

			await writer.switchInLevelToCollectables();

			i = 0;
			for (i; i < level.collectables.length; i += objectBatchSize) {
				await writer.writeCollectables(...level.collectables.slice(i, Math.min(i + objectBatchSize, level.collectables.length)));
			}

			await writer.endLevel();
		}
		await writer.endLevels();
		await writer.endSave();
		await writer.close();
	}

}